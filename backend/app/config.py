"""App configuration."""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    nebula_api_key: str = ""
    nebula_data_path: str = ""  # e.g. ../data/nebula-raw or /path/to/data/nebula-raw
    openai_api_key: str = ""
    gemini_api_key: str = ""
    groq_api_key: str = ""
    database_url: str = "sqlite+aiosqlite:///./ra_match.db"
    cors_origins: str = "http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:5176,http://localhost:5177,http://localhost:5178,http://localhost:5179,http://localhost:3000"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
