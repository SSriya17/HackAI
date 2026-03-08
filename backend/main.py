"""
RA Match API - Research Assistant matching for UTD (and future universities).

Run: uvicorn main:app --reload
Docs: http://localhost:8000/docs
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
import app.models.db as db
from app.providers.registry import init_providers
from app.api import professors, students, matches, email, voice, interview


@asynccontextmanager
async def lifespan(app: FastAPI):
    db.init_db(settings.database_url)
    async with db.engine.begin() as conn:
        await conn.run_sync(db.Base.metadata.create_all)
    init_providers(nebula_api_key=settings.nebula_api_key)
    yield
    await db.engine.dispose()


app = FastAPI(
    title="RA Match API",
    description="Match students to professors for Research Assistant opportunities. Built for UTD with Nebula Labs API.",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

_origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins if _origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(professors.router, prefix="/api")
app.include_router(students.router, prefix="/api")
app.include_router(matches.router, prefix="/api")
app.include_router(email.router, prefix="/api")
app.include_router(voice.router, prefix="/api")
app.include_router(interview.router, prefix="/api")


@app.get("/")
async def root():
    return {
        "name": "RA Match API",
        "docs": "/docs",
        "health": "ok",
    }


@app.get("/health")
async def health():
    return {"status": "ok"}
