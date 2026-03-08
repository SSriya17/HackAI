"""Provider registry - add new universities by implementing UniversityDataProvider."""
from pathlib import Path
from typing import Dict, Optional
from .base import UniversityDataProvider
from .nebula import NebulaProvider
from .nebula_raw import NebulaRawProvider


_registry: Dict[str, UniversityDataProvider] = {}


def register_provider(provider: UniversityDataProvider) -> None:
    _registry[provider.university_id] = provider


def get_provider(university_id: str = "utd") -> Optional[UniversityDataProvider]:
    return _registry.get(university_id)


def init_providers(nebula_api_key: str = "", nebula_data_path: str = "") -> None:
    """Initialize all providers. Prefer raw data if path exists, else Nebula API."""
    data_dir = Path(nebula_data_path) if nebula_data_path else Path(__file__).resolve().parent.parent.parent.parent / "data" / "nebula-raw"
    if data_dir.exists() and (data_dir / "combinedDB.professors.json").exists():
        register_provider(NebulaRawProvider(data_dir))
    else:
        register_provider(NebulaProvider(api_key=nebula_api_key))
    # Future: register_provider(MITProvider(...)), etc.
