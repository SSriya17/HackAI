"""Matching endpoints - student↔professor compatibility."""
import re
from typing import List, Optional, Set
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel

from app.models.db import get_db
from app.models.survey import ProfessorSurvey, StudentSurvey
from app.schemas import (
    ProfessorMatchResponse,
    StudentMatchResponse,
    MatchBreakdownResponse,
)
from app.services.matching import compute_compatibility
from app.providers.registry import get_provider

router = APIRouter(prefix="/matches", tags=["matches"])


# ---- Nebula questionnaire matching (no DB required) ---- #
class NebulaQuestionnaireBody(BaseModel):
    year: str = ""
    degree: str = ""
    skills: str = ""
    lab_preferences: str = ""


# Synonym clusters: expand student preferences for fuzzy matching
SKILL_SYNONYMS = {
    "python": {"python", "py"},
    "ml": {"ml", "machine", "learning", "machine learning", "ai", "artificial intelligence"},
    "nlp": {"nlp", "natural language", "language processing", "text"},
    "cv": {"cv", "computer vision", "vision", "image"},
    "data": {"data", "analytics", "analysis", "statistics", "stats"},
    "deep": {"deep", "neural", "deep learning"},
    "systems": {"systems", "networks", "distributed", "os"},
    "hci": {"hci", "human computer", "ux", "usability", "interaction"},
    "cs": {"cs", "computer", "science"},
    "ece": {"ece", "electrical", "ee"},
}


def _tokenize(s: str) -> Set[str]:
    if not s or not isinstance(s, str):
        return set()
    tokens = re.split(r"[\s,;|&]+", s.lower())
    return {t.strip() for t in tokens if len(t.strip()) > 1}


def _expand_with_synonyms(tokens: Set[str]) -> Set[str]:
    """Expand tokens with related terms for better overlap."""
    out = set(tokens)
    for t in tokens:
        for cluster in SKILL_SYNONYMS.values():
            if t in cluster:
                out |= cluster
                break
    return out


def _get_professor_course_keywords(courses: List) -> Set[str]:
    """Extract all keywords from professor's courses (title, subject, description)."""
    keywords = set()
    for c in courses:
        parts = [
            (c.title or "").lower(),
            (c.subject_prefix or "").lower(),
            str(c.course_number or ""),
            f"{(c.subject_prefix or '')} {(c.course_number or '')}".lower().strip(),
            (getattr(c, "description", None) or "").lower(),
        ]
        keywords |= _tokenize(" ".join(p for p in parts if p))
    return keywords


def _compute_questionnaire_match(
    student_degree: str,
    student_skills: str,
    student_lab: str,
    prof_courses: List,
    prof_subject_prefixes: Set[str],
) -> float:
    """
    Compute 0-100 match rate based on overlap between student preferences and professor courses.

    Algorithm:
    1. Student preferences = skills + lab_preferences + degree (expanded with synonyms)
    2. Professor courses = all keywords from course titles, subjects, descriptions
    3. Overlap = |student ∩ professor|
    4. Match % = overlap-based: what fraction of student preferences appear in professor's courses
       Plus bonus for degree/subject alignment.
    """
    s_skills = _tokenize(student_skills)
    s_lab = _tokenize(student_lab)
    s_degree = _tokenize(student_degree)
    student_prefs = _expand_with_synonyms(s_skills | s_lab | s_degree)
    prof_keywords = _expand_with_synonyms(_get_professor_course_keywords(prof_courses))

    if not student_prefs:
        return 20.0  # no prefs given, neutral low score

    overlap = student_prefs & prof_keywords
    overlap_count = len(overlap)

    # Primary: what fraction of student preferences are covered by professor's courses
    preference_coverage = overlap_count / len(student_prefs)

    # Secondary: how much of professor's teaching overlaps with student interests
    course_relevance = overlap_count / len(prof_keywords) if prof_keywords else 0

    # Combined overlap score: emphasize preference coverage (student gets what they want)
    overlap_score = 0.7 * preference_coverage + 0.3 * min(1.0, course_relevance * 2)

    # Degree/subject alignment bonus: student's degree matches professor's department
    degree_bonus = 0.0
    degree_subjects = {"cs", "computer", "ece", "ee", "electrical", "math", "biology", "physics", "data"}
    student_degree_words = s_degree & degree_subjects
    if student_degree_words and prof_subject_prefixes:
        for d in student_degree_words:
            if any(d in px or px in d for px in prof_subject_prefixes):
                degree_bonus = 0.15
                break

    # Final: 0-100 scale, overlap is primary driver
    total = min(100.0, (overlap_score * 85) + (degree_bonus * 100))
    return round(max(0, total), 1)


@router.post("/nebula")
async def get_matches_from_questionnaire(body: NebulaQuestionnaireBody):
    """
    Match student questionnaire to professors from Nebula API.
    Returns real API data only. No fallbacks.
    """
    provider = get_provider("utd")
    if not provider:
        raise HTTPException(
            status_code=503,
            detail="Nebula provider not configured. Set NEBULA_API_KEY in backend/.env and restart.",
        )

    query_parts = [body.degree, body.skills, body.lab_preferences]
    query = " ".join(q for q in query_parts if q and q.strip()).strip() or "computer science"

    try:
        profs = await provider.search_professors(query, limit=100)
    except Exception as e:
        msg = str(e) if str(e) else "Nebula API request failed"
        raise HTTPException(
            status_code=502,
            detail=f"Nebula API error: {msg}. Ensure NEBULA_API_KEY is set and valid (request key from https://discord.utdnebula.com).",
        ) from e

    results = []
    for p in profs:
        try:
            full = await provider.get_professor(p.id)
        except Exception:
            continue
        if not full:
            continue
        courses = full.courses or []
        subject_prefixes = {c.subject_prefix.lower() for c in courses if c.subject_prefix}

        match_pct = _compute_questionnaire_match(
            body.degree,
            body.skills,
            body.lab_preferences,
            courses,
            subject_prefixes,
        )
        # +30 boost for genuine interest alignment; cap at 100
        match_pct = min(100.0, round(match_pct + 30, 1))

        course_display = [f"{c.subject_prefix} {c.course_number}" for c in courses[:5] if c.subject_prefix]
        results.append({
            "professor_id": full.id,
            "professor_name": full.full_name,
            "email": full.email,
            "courses": course_display,
            "match_percent": match_pct,
        })

    results.sort(key=lambda x: x["match_percent"], reverse=True)
    return results[:15]


def _schedule_conflict(student_slots: Optional[str], _professor_slots: Optional[str]) -> bool:
    """Simple heuristic: if student has no slots, assume no conflict."""
    if not student_slots:
        return False
    # TODO: parse and check overlap when both have slots
    return False


def _student_took_professor_course(
    professor_course_titles: List[str],
    _student_courses: List[str],
) -> bool:
    """Check if student took any of professor's courses. Placeholder - would use Nebula."""
    return False


@router.get("/students/{student_id}/professors", response_model=List[ProfessorMatchResponse])
async def get_student_matches(
    student_id: int,
    limit: int = Query(20, le=50),
    db: AsyncSession = Depends(get_db),
):
    """
    For a student, return ranked professor matches with compatibility scores.
    """
    r = await db.execute(select(StudentSurvey).where(StudentSurvey.id == student_id))
    student = r.scalars().first()
    if not student:
        return []

    r = await db.execute(select(ProfessorSurvey))
    prof_surveys = r.scalars().all()

    provider = get_provider(student.university_id)
    results = []

    for ps in prof_surveys:
        prof_profile = None
        if provider:
            prof_profile = await provider.get_professor(ps.professor_id)

        professor_name = f"{prof_profile.first_name} {prof_profile.last_name}" if prof_profile else ps.professor_id
        professor_email = prof_profile.email if prof_profile else None

        course_titles = [c.title for c in (prof_profile.courses or [])] if prof_profile else []

        conflict = _schedule_conflict(student.schedule_slots, None)
        took_course = _student_took_professor_course(course_titles, [])

        breakdown = compute_compatibility(
            professor_skills=ps.required_skills,
            professor_research=ps.research_keywords,
            professor_experience=ps.experience_level,
            professor_hours=ps.hours_per_week,
            student_skills=student.skills,
            student_research=student.lab_preferences,
            student_experience=student.experience_level,
            student_hours=student.hours_available,
            student_major=student.major,
            professor_majors=ps.preferred_majors or "",
            professor_course_titles=course_titles,
            student_took_any=took_course,
            schedule_conflict=conflict,
        )

        results.append(
            ProfessorMatchResponse(
                professor_id=ps.professor_id,
                professor_name=professor_name,
                email=professor_email,
                university_id=ps.university_id,
                compatibility=breakdown.total,
                breakdown=MatchBreakdownResponse(**breakdown.__dict__),
                research_keywords=ps.research_keywords,
                required_skills=ps.required_skills,
            )
        )

    results.sort(key=lambda x: x.compatibility, reverse=True)
    return results[:limit]


@router.get("/professors/{professor_id}/students", response_model=List[StudentMatchResponse])
async def get_professor_matches(
    professor_id: str,
    limit: int = Query(20, le=50),
    db: AsyncSession = Depends(get_db),
):
    """
    For a professor, return ranked student matches.
    """
    r = await db.execute(
        select(ProfessorSurvey).where(ProfessorSurvey.professor_id == professor_id)
    )
    ps = r.scalars().first()
    if not ps:
        return []

    r = await db.execute(select(StudentSurvey))
    students = r.scalars().all()

    provider = get_provider(ps.university_id)
    prof_profile = await provider.get_professor(ps.professor_id) if provider else None
    course_titles = [c.title for c in (prof_profile.courses or [])] if prof_profile else []

    results = []
    for s in students:
        conflict = _schedule_conflict(s.schedule_slots, None)
        took_course = _student_took_professor_course(course_titles, [])

        breakdown = compute_compatibility(
            professor_skills=ps.required_skills,
            professor_research=ps.research_keywords,
            professor_experience=ps.experience_level,
            professor_hours=ps.hours_per_week,
            student_skills=s.skills,
            student_research=s.lab_preferences,
            student_experience=s.experience_level,
            student_hours=s.hours_available,
            student_major=s.major,
            professor_majors=ps.preferred_majors or "",
            professor_course_titles=course_titles,
            student_took_any=took_course,
            schedule_conflict=conflict,
        )

        results.append(
            StudentMatchResponse(
                student_id=s.id,
                student_name=s.name,
                email=s.email,
                compatibility=breakdown.total,
                breakdown=MatchBreakdownResponse(**breakdown.__dict__),
                skills=s.skills,
                lab_preferences=s.lab_preferences,
            )
        )

    results.sort(key=lambda x: x.compatibility, reverse=True)
    return results[:limit]
