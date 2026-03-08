"""Nebula raw data provider - reads from local JSON export instead of API."""
import json
from pathlib import Path
from typing import Optional, Union, List, Dict

from .base import UniversityDataProvider, ProfessorProfile, CourseInfo


def _oid(obj) -> str:
    """Extract MongoDB ObjectId string from raw JSON."""
    if isinstance(obj, dict) and "$oid" in obj:
        return obj["$oid"]
    if isinstance(obj, str):
        return obj
    return str(obj) if obj else ""


class NebulaRawProvider(UniversityDataProvider):
    """Read professors/courses from Nebula raw JSON export. No API key required."""

    def __init__(self, data_dir: Union[str, Path]):
        self._data_dir = Path(data_dir)
        self._professors: list[dict] = []
        self._courses_by_id: dict[str, dict] = {}
        self._sections: list[dict] = []
        self._professor_courses: dict[str, list[dict]] = {}
        self._professors_by_id: dict[str, dict] = {}
        self._loaded = False

    @property
    def university_id(self) -> str:
        return "utd"

    def _load(self) -> None:
        if self._loaded:
            return
        prof_path = self._data_dir / "combinedDB.professors.json"
        course_path = self._data_dir / "combinedDB.courses.json"
        section_path = self._data_dir / "combinedDB.sections.json"
        if not prof_path.exists():
            raise FileNotFoundError(f"Nebula raw data not found at {self._data_dir}")
        with open(prof_path, encoding="utf-8") as f:
            self._professors = json.load(f)
        for p in self._professors:
            pid = _oid(p.get("_id"))
            self._professors_by_id[pid] = p
        with open(course_path, encoding="utf-8") as f:
            courses = json.load(f)
        for c in courses:
            cid = _oid(c.get("_id"))
            self._courses_by_id[cid] = c
        with open(section_path, encoding="utf-8") as f:
            self._sections = json.load(f)
        # Build professor -> courses via sections
        for sec in self._sections:
            course_id = _oid(sec.get("course_reference"))
            if not course_id or course_id not in self._courses_by_id:
                continue
            for prof_obj in sec.get("professors", []):
                pid = _oid(prof_obj)
                if pid not in self._professor_courses:
                    self._professor_courses[pid] = []
                course = self._courses_by_id[course_id]
                if course not in self._professor_courses[pid]:
                    self._professor_courses[pid].append(course)
        self._loaded = True

    def _to_course(self, raw: dict) -> CourseInfo:
        return CourseInfo(
            id=_oid(raw.get("_id")),
            title=raw.get("title", ""),
            subject_prefix=raw.get("subject_prefix", ""),
            course_number=raw.get("course_number", ""),
            description=raw.get("description"),
        )

    def _to_professor(self, raw: dict, courses: Optional[List[CourseInfo]] = None) -> ProfessorProfile:
        office = raw.get("office")
        office_str = None
        if isinstance(office, dict):
            office_str = f"{office.get('building', '')} {office.get('room', '')}".strip()
        pid = _oid(raw.get("_id"))
        return ProfessorProfile(
            id=pid,
            first_name=raw.get("first_name", ""),
            last_name=raw.get("last_name", ""),
            email=raw.get("email"),
            phone=raw.get("phone_number"),
            courses=courses or [],
            office=office_str,
            image_uri=raw.get("image_uri"),
            profile_uri=raw.get("profile_uri"),
            university_id=self.university_id,
        )

    async def get_professor(self, professor_id: str) -> Optional[ProfessorProfile]:
        self._load()
        raw = self._professors_by_id.get(professor_id)
        if not raw:
            return None
        course_raws = self._professor_courses.get(professor_id, [])
        courses = [self._to_course(c) for c in course_raws]
        return self._to_professor(raw, courses)

    async def search_professors(self, query: str, limit: int = 100) -> list[ProfessorProfile]:
        self._load()
        # Return professors from raw data. Query ignored; limit applied.
        result = []
        for raw in self._professors[:limit]:
            pid = _oid(raw.get("_id"))
            course_raws = self._professor_courses.get(pid, [])
            courses = [self._to_course(c) for c in course_raws]
            result.append(self._to_professor(raw, courses))
        return result

    async def get_professor_courses(self, professor_id: str) -> list[CourseInfo]:
        prof = await self.get_professor(professor_id)
        return prof.courses if prof else []
