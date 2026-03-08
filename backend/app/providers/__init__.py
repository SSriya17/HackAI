"""University data providers - abstract interface for multi-university scaling."""
from .base import UniversityDataProvider, ProfessorProfile, CourseInfo
from .nebula import NebulaProvider

__all__ = [
    "UniversityDataProvider",
    "ProfessorProfile",
    "CourseInfo",
    "NebulaProvider",
]
