"""App configuration."""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    nebula_api_key: str = ""
    openai_api_key: str = ""
    gemini_api_key: str = ""
    groq_api_key: str = ""
    database_url: str = "sqlite+aiosqlite:///./ra_match.db"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
