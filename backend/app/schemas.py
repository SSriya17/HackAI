"""Pydantic schemas for API request/response."""
from pydantic import BaseModel


# ---- Professor ---- #
class ProfessorSurveyCreate(BaseModel):
    professor_id: str
    university_id: str = "utd"
    research_keywords: str
    required_skills: str
    preferred_majors: str | None = None
    experience_level: str  # undergrad, masters, phd, any
    hours_per_week: int
    paid: bool = True
    description: str | None = None


class ProfessorSurveyResponse(BaseModel):
    id: int
    professor_id: str
    university_id: str
    research_keywords: str
    required_skills: str
    preferred_majors: str | None
    experience_level: str
    hours_per_week: int
    paid: bool
    description: str | None

    class Config:
        from_attributes = True


# ---- Student ---- #
class StudentSurveyCreate(BaseModel):
    email: str
    name: str
    major: str
    university_id: str = "utd"
    skills: str
    lab_preferences: str
    experience_level: str  # none, some, experienced
    hours_available: int
    schedule_slots: str | None = None


class StudentSurveyResponse(BaseModel):
    id: int
    email: str
    name: str
    major: str
    university_id: str
    skills: str
    lab_preferences: str
    experience_level: str
    hours_available: int
    schedule_slots: str | None

    class Config:
        from_attributes = True


# ---- Match ---- #
class MatchBreakdownResponse(BaseModel):
    skill_match: float
    research_match: float
    schedule_penalty: float
    experience_match: float
    course_bonus: float
    total: float
    details: dict


class ProfessorMatchResponse(BaseModel):
    professor_id: str
    professor_name: str
    email: str | None
    university_id: str
    compatibility: float
    breakdown: MatchBreakdownResponse
    research_keywords: str
    required_skills: str


class StudentMatchResponse(BaseModel):
    student_id: int
    student_name: str
    email: str
    compatibility: float
    breakdown: MatchBreakdownResponse
    skills: str
    lab_preferences: str


# ---- Nebula / Provider ---- #
class EmailGenerateRequest(BaseModel):
    professor_name: str
    professor_id: str
    student_name: str
    student_lab_preferences: str
    student_skills: str = ""


class ProfessorProfileResponse(BaseModel):
    id: str
    first_name: str
    last_name: str
    full_name: str
    email: str | None
    phone: str | None
    office: str | None
    courses: list[dict]
    university_id: str
