"""Student survey endpoints."""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.db import get_db
from app.models.survey import StudentSurvey
from app.schemas import StudentSurveyCreate, StudentSurveyResponse

router = APIRouter(prefix="/students", tags=["students"])


@router.post("/surveys", response_model=StudentSurveyResponse)
async def create_student_survey(
    body: StudentSurveyCreate,
    db: AsyncSession = Depends(get_db),
):
    """Student fills out schedule, major, skills, lab preferences."""
    survey = StudentSurvey(
        email=body.email,
        name=body.name,
        major=body.major,
        university_id=body.university_id,
        skills=body.skills,
        lab_preferences=body.lab_preferences,
        experience_level=body.experience_level,
        hours_available=body.hours_available,
        schedule_slots=body.schedule_slots,
    )
    db.add(survey)
    await db.flush()
    await db.refresh(survey)
    return survey
