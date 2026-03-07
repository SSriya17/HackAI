"""Survey models - professor and student preferences for RA matching."""
from sqlalchemy import String, Text, Integer, Float, JSON, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

from .db import Base


class ProfessorSurvey(Base):
    """Professor survey: what kind of RA they want."""
    __tablename__ = "professor_surveys"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    # Link to campus API profile (Nebula professor id)
    professor_id: Mapped[str] = mapped_column(String(64), index=True)
    university_id: Mapped[str] = mapped_column(String(32), default="utd")

    # Research & requirements
    research_keywords: Mapped[str] = mapped_column(Text)  # comma-separated: ML, Python, NLP
    required_skills: Mapped[str] = mapped_column(Text)  # comma-separated
    preferred_majors: Mapped[str] = mapped_column(Text, nullable=True)
    experience_level: Mapped[str] = mapped_column(String(32))  # undergrad, masters, phd, any
    hours_per_week: Mapped[int] = mapped_column(Integer)  # e.g. 10, 20
    paid: Mapped[bool] = mapped_column(default=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class StudentSurvey(Base):
    """Student survey: schedule, skills, lab preferences."""
    __tablename__ = "student_surveys"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(255), index=True)
    name: Mapped[str] = mapped_column(String(255))
    major: Mapped[str] = mapped_column(String(128))
    university_id: Mapped[str] = mapped_column(String(32), default="utd")

    # Skills and interests
    skills: Mapped[str] = mapped_column(Text)  # comma-separated
    lab_preferences: Mapped[str] = mapped_column(Text)  # comma-separated: ML, NLP, HCI
    experience_level: Mapped[str] = mapped_column(String(32))  # none, some, experienced
    hours_available: Mapped[int] = mapped_column(Integer)

    # Schedule: JSON array of {day, start, end} or "mon 9-11, tue 14-16"
    schedule_slots: Mapped[str] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
