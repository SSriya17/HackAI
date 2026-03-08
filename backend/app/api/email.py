"""Cold email generation - contextual outreach using professor research."""
from fastapi import APIRouter

from app.schemas import EmailGenerateRequest
from app.services.email_generator import generate_cold_email

router = APIRouter(prefix="/email", tags=["email"])


@router.post("/generate")
async def generate_email(body: EmailGenerateRequest):
    """
    Generate a contextual cold email for a student to reach out to a professor.
    Uses Semantic Scholar to pull professor's research and tailor the message.
    """
    result = await generate_cold_email(
        professor_name=body.professor_name,
        professor_id=body.professor_id,
        student_name=body.student_name,
        student_lab_preferences=body.student_lab_preferences,
        student_skills=body.student_skills,
    )
    return result
