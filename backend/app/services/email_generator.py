"""
Cold email generator - pulls professor research from Semantic Scholar (free API).
Generates contextual "why I'm interested in your work" paragraph.
"""
import httpx
from typing import Optional


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


def _generate_interest_paragraph(
    professor_name: str,
    papers: list[dict],
    student_lab_prefs: str,
) -> str:
    """Generate a paragraph referencing specific research."""
    if not papers:
        return (
            f"I am writing to express my interest in joining your research group as an undergraduate research assistant. "
            f"I am particularly interested in {student_lab_prefs}, and I believe I could contribute meaningfully to your lab. "
            f"I would welcome the opportunity to discuss how my background might align with your research."
        )

    top = papers[0]
    title = top.get("title", "your recent work")
    abstract = (top.get("abstract") or "")[:400]

    interest_ref = ""
    if abstract:
        # Use first 2 sentences of abstract as context
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
) -> dict:
    """
    Generate a contextual cold email for a student to reach out to a professor.

    Returns:
        dict with keys: email_text, papers_used, success
    """
    author = await _search_author(professor_name)
    if not author:
        return {
            "email_text": _generate_interest_paragraph(professor_name, [], student_lab_preferences),
            "papers_used": [],
            "success": False,
        }

    author_id = author.get("authorId")
    papers = await _get_author_papers(author_id, limit=3) if author_id else []

    email_text = _generate_interest_paragraph(professor_name, papers, student_lab_preferences)
    papers_used = [{"title": p.get("title"), "year": p.get("year")} for p in papers]

    return {
        "email_text": email_text,
        "papers_used": papers_used,
        "success": len(papers) > 0,
    }
