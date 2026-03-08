"""Matching endpoints - student↔professor compatibility."""
from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

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
