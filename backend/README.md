# RA Match Backend

Research Assistant matching API – connects students with professors for RA opportunities. Built for UTD with **Nebula Labs Coursebook API**, designed to scale to other universities.

## Quick Start

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # or `.venv\Scripts\activate` on Windows
pip install -r requirements.txt
cp .env.example .env       # add NEBULA_API_KEY (get from discord.utdnebula.com)
uvicorn main:app --reload
```

- **API docs**: http://localhost:8000/docs
- **Health**: http://localhost:8000/health

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/professors/surveys` | Professor submits RA requirements |
| GET | `/api/professors/surveys/{professor_id}` | Get professor survey |
| GET | `/api/professors/nebula/{id}` | Fetch professor from Nebula (UTD) |
| GET | `/api/professors/nebula/search?q=` | Search professors in Nebula |
| POST | `/api/students/surveys` | Student submits profile |
| GET | `/api/matches/students/{id}/professors` | Ranked professor matches for student |
| GET | `/api/matches/professors/{id}/students` | Ranked student matches for professor |
| POST | `/api/email/generate` | Generate cold email using professor research (Semantic Scholar) |

## Matching Algorithm

Weighted multi-factor compatibility:
- **Skills** (30%): Overlap of required vs. stated skills (Python, ML, etc.)
- **Research** (30%): Lab/research area alignment
- **Schedule** (20%): Conflict penalty
- **Experience** (15%): Level alignment (undergrad, masters, PhD)
- **Course overlap** (5%): Bonus if student took professor’s course

## Scaling to Other Universities

The backend uses a **provider abstraction**:

1. Implement `UniversityDataProvider` in `app/providers/base.py`
2. Add your provider (e.g. `app/providers/mit.py`)
3. Register in `app/providers/registry.py`

Example:

```python
# app/providers/mit.py
class MITProvider(UniversityDataProvider):
    @property
    def university_id(self) -> str:
        return "mit"
    # ... implement get_professor, search_professors, get_professor_courses
```

## Tech Stack

- **FastAPI** – async, auto OpenAPI docs
- **SQLAlchemy 2** – async, SQLite (dev) / Postgres (prod)
- **Nebula API** – UTD professors & courses
- **Semantic Scholar** – professor research for cold emails
