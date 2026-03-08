"""Nebula Labs API provider for UTD - Coursebook, professors, courses."""
import httpx
from typing import Optional, Union, List
from .base import UniversityDataProvider, ProfessorProfile, CourseInfo


class NebulaProvider(UniversityDataProvider):
    """UTD-specific provider using Nebula Labs API."""
    BASE_URL = "https://api.utdnebula.com"

    def __init__(self, api_key: str = ""):
        self._api_key = api_key
        self._headers = {}
        if api_key:
            self._headers["x-api-key"] = api_key

    @property
    def university_id(self) -> str:
        return "utd"

    def _url(self, path: str) -> str:
        return f"{self.BASE_URL}{path}"

    async def _get(self, path: str, params: dict = None):
        async with httpx.AsyncClient(timeout=15.0) as client:
            r = await client.get(
                self._url(path),
                headers=self._headers,
                params=params or {},
            )
            r.raise_for_status()
            data = r.json()
            return data.get("data") if isinstance(data, dict) else data

    def _to_course(self, raw: dict) -> CourseInfo:
        return CourseInfo(
            id=str(raw.get("_id", "")),
            title=raw.get("title", ""),
            subject_prefix=raw.get("subject_prefix", ""),
            course_number=raw.get("course_number", ""),
            description=raw.get("description"),
        )

    def _to_professor(self, raw: dict, courses: list[CourseInfo] = None) -> ProfessorProfile:
        office = raw.get("office")
        office_str = None
        if isinstance(office, dict):
            office_str = f"{office.get('building', '')} {office.get('room', '')}".strip()
        return ProfessorProfile(
            id=str(raw.get("_id", "")),
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
        try:
            raw = await self._get(f"/professor/{professor_id}")
            if not raw:
                return None
            courses = await self.get_professor_courses(professor_id)
            return self._to_professor(raw, courses)
        except (httpx.HTTPError, KeyError):
            return None

    async def search_professors(self, query: str, limit: int = 20) -> list[ProfessorProfile]:
        try:
            raw_list = await self._get("/professor", params={"q": query, "limit": limit})
            if not isinstance(raw_list, list):
                return []
            return [self._to_professor(p) for p in raw_list[:limit]]
        except (httpx.HTTPError, KeyError):
            return []

    async def get_professor_courses(self, professor_id: str) -> list[CourseInfo]:
        try:
            raw_list = await self._get(f"/professor/{professor_id}/courses")
            if not isinstance(raw_list, list):
                return []
            return [self._to_course(c) for c in raw_list]
        except (httpx.HTTPError, KeyError):
            return []
