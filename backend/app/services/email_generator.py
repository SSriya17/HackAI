"""
Cold email generator - pulls professor research from Semantic Scholar (free API).
Generates contextual "why I'm interested in your work" paragraph.
"""
import httpx
from typing import Optional, List, Dict
from openai import AsyncOpenAI
from app.config import settings


SEMANTIC_SCHOLAR_BASE = "https://api.semanticscholar.org/graph/v1"


async def _search_author(name: str) -> Optional[dict]:
    """Search for author by name. Returns first match."""
    async with httpx.AsyncClient(timeout=10.0) as client:
        r = await client.get(
            f"{SEMANTIC_SCHOLAR_BASE}/author/search",
            params={"query": name, "limit": 5},
        )
        if r.status_code != 200:
            return None
        data = r.json()
        authors = data.get("data", [])
        if not authors:
            return None
        return authors[0]


async def _get_author_papers(author_id: str, limit: int = 5) -> list[dict]:
    """Fetch recent papers for an author."""
    async with httpx.AsyncClient(timeout=10.0) as client:
        r = await client.get(
            f"{SEMANTIC_SCHOLAR_BASE}/author/{author_id}/papers",
            params={
                "fields": "title,abstract,year",
                "limit": limit,
            },
        )
        if r.status_code != 200:
            return []
        data = r.json()
        return data.get("data", [])


async def _generate_email_with_llm(
    professor_name: str,
    papers: List[Dict],
    student_name: str,
    student_lab_prefs: str,
    student_skills: str,
    professor_courses: Optional[List[str]] = None,
) -> str:
    """Generate a convincing cold email using OpenAI."""
    if not settings.openai_api_key:
        return _generate_template_email(professor_name, papers, student_lab_prefs, professor_courses or [])

    client = AsyncOpenAI(api_key=settings.openai_api_key)
    
    papers_context = ""
    if papers:
        papers_context = "Recent research papers by the professor:\n"
        for p in papers:
            papers_context += f"- {p.get('title')} ({p.get('year')}): {p.get('abstract', '')[:300]}...\n"

    courses_context = ""
    if professor_courses:
        courses_context = f"Professor teaches these courses (reference to show genuine interest): {', '.join(professor_courses)}\n"

    prompt = f"""
You are a helpful assistant that writes professional and convincing cold emails for students seeking research opportunities.

Student Name: {student_name}
Student Skills: {student_skills}
Student Research Interests: {student_lab_prefs}

Professor Name: {professor_name}
{papers_context}
{courses_context}

Task:
Write a professional, concise, and personalized cold email from the student to the professor. 
The email should:
1. Express interest in joining the professor's lab as a research assistant.
2. Reference at least one of the professor's recent papers, courses taught, or research areas specifically to show genuine interest.
3. Briefly mention how the student's skills and interests align with the lab's work.
4. Request a brief meeting or interview to discuss potential opportunities.
5. Keep it under 200 words.

Email:
"""
    try:
        response = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,
            temperature=0.7,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"LLM Error: {e}")
        return _generate_template_email(professor_name, papers, student_lab_prefs, professor_courses or [])


def _generate_template_email(
    professor_name: str,
    papers: List[Dict],
    student_lab_prefs: str,
    professor_courses: Optional[List[str]] = None,
) -> str:
    """Fallback template-based email - uses courses from API when no papers."""
    prof_courses = professor_courses or []
    if not papers and not prof_courses:
        return (
            f"Dear Professor {professor_name.split()[-1] if professor_name else 'Researcher'},\n\n"
            f"I am writing to express my interest in joining your research group as an undergraduate research assistant. "
            f"I am particularly interested in {student_lab_prefs}, and I believe I could contribute meaningfully to your lab. "
            f"I would welcome the opportunity to discuss how my background might align with your research."
        )

    if prof_courses:
        courses_ref = ", ".join(prof_courses[:3])
        return (
            f"Dear Professor {professor_name.split()[-1] if professor_name else 'Researcher'},\n\n"
            f"I am writing to express my interest in joining your research group as an undergraduate research assistant. "
            f"I noticed you teach {courses_ref}, and I am particularly interested in {student_lab_prefs}. "
            f"I believe I could contribute meaningfully to your lab and would welcome the opportunity to discuss potential opportunities."
        )
    top = papers[0]
    title = top.get("title", "your recent work")
    abstract = (top.get("abstract") or "")[:400]

    interest_ref = ""
    if abstract:
        sentences = abstract.replace(". ", ".|").split("|")[:2]
        interest_ref = " ".join(sentences).strip()
    else:
        interest_ref = f"your paper \"{title}\""

    return (
        f"Dear Professor {professor_name.split()[-1] if professor_name else 'Researcher'},\n\n"
        f"I am writing to express my interest in joining your research group as an undergraduate research assistant. "
        f"I was particularly drawn to {interest_ref}. "
        f"I am interested in {student_lab_prefs} and believe I could contribute to your lab. "
        f"I would welcome the opportunity to discuss how my background might align with your research."
    )


async def generate_cold_email(
    professor_name: str,
    professor_id: str,
    student_name: str,
    student_lab_preferences: str,
    student_skills: str = "",
    professor_courses: Optional[List[str]] = None,
) -> dict:
    """
    Generate a contextual cold email for a student to reach out to a professor.

    Returns:
        dict with keys: email_text, papers_used, success
    """
    professor_courses = professor_courses or []
    author = await _search_author(professor_name)
    papers = []
    if author:
        author_id = author.get("authorId")
        papers = await _get_author_papers(author_id, limit=3) if author_id else []

    if not papers and not professor_courses:
        return {
            "email_text": _generate_template_email(professor_name, [], student_lab_preferences, []),
            "papers_used": [],
            "success": False,
        }

    email_text = await _generate_email_with_llm(
        professor_name=professor_name,
        papers=papers,
        student_name=student_name,
        student_lab_prefs=student_lab_preferences,
        student_skills=student_skills,
        professor_courses=professor_courses,
    )
    papers_used = [{"title": p.get("title"), "year": p.get("year")} for p in papers]

    return {
        "email_text": email_text,
        "papers_used": papers_used,
        "success": len(papers) > 0 or len(professor_courses) > 0,
    }
