"""Cold email generation - contextual outreach using professor research."""
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.db import get_db
from app.models.survey import EmailLog
from app.schemas import EmailGenerateRequest, EmailLogResponse, EmailStatusUpdate
from app.services.email_generator import generate_cold_email

router = APIRouter(prefix="/email", tags=["email"])


@router.post("/generate")
async def generate_email(
    body: EmailGenerateRequest,
    db: AsyncSession = Depends(get_db)
):
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
    
    # Log the email if generation was successful
    if result.get("success"):
        log = EmailLog(
            student_name=body.student_name,
            professor_name=body.professor_name,
            professor_id=body.professor_id,
            email_text=result["email_text"],
            status="sent"
        )
        db.add(log)
        await db.commit()
        await db.refresh(log)
        result["log_id"] = log.id

    return result


@router.get("/logs", response_model=List[EmailLogResponse])
async def get_email_logs(db: AsyncSession = Depends(get_db)):
    """Fetch all sent cold emails and their statuses."""
    r = await db.execute(select(EmailLog).order_by(EmailLog.created_at.desc()))
    return r.scalars().all()


@router.get("/logs/professor/{professor_name}", response_model=List[EmailLogResponse])
async def get_professor_email_logs(
    professor_name: str, 
    db: AsyncSession = Depends(get_db)
):
    """Fetch all cold emails (applications) sent to a specific professor."""
    r = await db.execute(
        select(EmailLog)
        .where(EmailLog.professor_name == professor_name)
        .order_by(EmailLog.created_at.desc())
    )
    return r.scalars().all()


@router.patch("/logs/{log_id}/status", response_model=EmailLogResponse)
async def update_email_status(
    log_id: int,
    body: EmailStatusUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update the application status for a sent email."""
    r = await db.execute(select(EmailLog).where(EmailLog.id == log_id))
    log = r.scalars().first()
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    
    log.status = body.status
    await db.commit()
    await db.refresh(log)
    return log

