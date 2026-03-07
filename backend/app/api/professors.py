"""Professor survey & Nebula professor endpoints."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.db import get_db
from app.models.survey import ProfessorSurvey
from app.schemas import ProfessorSurveyCreate, ProfessorSurveyResponse, ProfessorProfileResponse
from app.providers.registry import get_provider

router = APIRouter(prefix="/professors", tags=["professors"])


@router.post("/surveys", response_model=ProfessorSurveyResponse)
async def create_professor_survey(
    body: ProfessorSurveyCreate,
    db: AsyncSession = Depends(get_db),
):
    """Professor fills out what kind of RA they need."""
    survey = ProfessorSurvey(
        professor_id=body.professor_id,
        university_id=body.university_id,
        research_keywords=body.research_keywords,
        required_skills=body.required_skills,
        preferred_majors=body.preferred_majors,
        experience_level=body.experience_level,
        hours_per_week=body.hours_per_week,
        paid=body.paid,
        description=body.description,
    )
    db.add(survey)
    await db.flush()
    await db.refresh(survey)
    return survey


@router.get("/surveys/{professor_id}", response_model=ProfessorSurveyResponse | None)
async def get_professor_survey(
    professor_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get survey for a professor (by Nebula professor id)."""
    r = await db.execute(
        select(ProfessorSurvey).where(ProfessorSurvey.professor_id == professor_id)
    )
    survey = r.scalars().first()
    return survey


@router.get("/nebula/{professor_id}", response_model=ProfessorProfileResponse)
async def get_professor_from_nebula(professor_id: str):
    """Fetch professor profile from Nebula API (UTD Coursebook)."""
    provider = get_provider("utd")
    if not provider:
        raise HTTPException(status_code=503, detail="Nebula provider not initialized")
    prof = await provider.get_professor(professor_id)
    if not prof:
        raise HTTPException(status_code=404, detail="Professor not found")
    return ProfessorProfileResponse(
        id=prof.id,
        first_name=prof.first_name,
        last_name=prof.last_name,
        full_name=prof.full_name,
        email=prof.email,
        phone=prof.phone,
        office=prof.office,
        courses=[{"title": c.title, "subject_prefix": c.subject_prefix, "course_number": c.course_number} for c in prof.courses],
        university_id=prof.university_id,
    )


@router.get("/nebula/search")
async def search_professors_nebula(q: str, limit: int = 20):
    """Search professors in Nebula (UTD)."""
    provider = get_provider("utd")
    if not provider:
        raise HTTPException(status_code=503, detail="Nebula provider not initialized")
    profs = await provider.search_professors(q, limit=limit)
    return [
        {
            "id": p.id,
            "full_name": p.full_name,
            "email": p.email,
            "courses": [f"{c.subject_prefix} {c.course_number}" for c in p.courses[:5]],
        }
        for p in profs
    ]
