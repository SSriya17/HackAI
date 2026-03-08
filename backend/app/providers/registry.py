"""Provider registry - add new universities by implementing UniversityDataProvider."""
from typing import Dict, Optional
from .base import UniversityDataProvider
from .nebula import NebulaProvider


_registry: Dict[str, UniversityDataProvider] = {}


def register_provider(provider: UniversityDataProvider) -> None:
    _registry[provider.university_id] = provider


def get_provider(university_id: str = "utd") -> Optional[UniversityDataProvider]:
    return _registry.get(university_id)


def init_providers(nebula_api_key: str = "") -> None:
    """Initialize all providers. Call at startup."""
    register_provider(NebulaProvider(api_key=nebula_api_key))
    # Future: register_provider(MITProvider(...)), etc.
