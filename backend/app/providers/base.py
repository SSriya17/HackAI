"""Abstract base for university data providers - swap in different APIs per campus."""
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Optional


@dataclass
class CourseInfo:
    """Course taught by a professor - normalized across providers."""
    id: str
    title: str
    subject_prefix: str
    course_number: str
    description: Optional[str] = None


@dataclass
class ProfessorProfile:
    """Professor profile from campus API - normalized across providers."""
    id: str
    first_name: str
    last_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    courses: list[CourseInfo] = None
    office: Optional[str] = None
    image_uri: Optional[str] = None
    profile_uri: Optional[str] = None
    university_id: str = "utd"  # for multi-university: utd, mit, etc.

    def __post_init__(self):
        if self.courses is None:
            self.courses = []

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"


class UniversityDataProvider(ABC):
    """Interface for fetching professor/course data. Implement per university."""

    @property
    @abstractmethod
    def university_id(self) -> str:
        """e.g. 'utd', 'mit' - used when scaling to other schools."""
        pass

    @abstractmethod
    async def get_professor(self, professor_id: str) -> Optional[ProfessorProfile]:
        """Fetch a single professor by ID."""
        pass

    @abstractmethod
    async def search_professors(self, query: str, limit: int = 20) -> list[ProfessorProfile]:
        """Search professors by name or other criteria."""
        pass

    @abstractmethod
    async def get_professor_courses(self, professor_id: str) -> list[CourseInfo]:
        """Fetch courses taught by a professor."""
        pass
