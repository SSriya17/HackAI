# Sreya (Backend Lead)

## Team Members

- [x] Sreya
- [x] Shriya

**Branch:** Use one shared branch for backend (`Sreya` or `backend`) – both work here.

## Focus / Responsibility

**RA Match Backend** – Research Assistant matching API for UTD (and scalable to other universities).

- Professor & student surveys
- Compatibility scoring algorithm
- Nebula Labs API integration (UTD Coursebook)
- Cold email generator (Semantic Scholar)
- Provider abstraction for multi-university scaling

## Project Structure

The backend lives in **`backend/`** at repo root:

```
backend/
├── main.py              # FastAPI app
├── app/
│   ├── api/             # Routes: professors, students, matches, email
│   ├── models/          # DB: ProfessorSurvey, StudentSurvey
│   ├── providers/       # University API abstraction (Nebula for UTD)
│   ├── services/        # Matching algorithm, email generator
│   └── schemas.py
├── requirements.txt
└── README.md
```

See **[backend/README.md](../backend/README.md)** for setup and API details.

## Progress

- [x] FastAPI scaffold + provider abstraction
- [x] Nebula API client (UTD)
- [x] Survey models + matching algorithm
- [x] API routes (surveys, matches, cold email)
- [ ] NEBULA_API_KEY (request at discord.utdnebula.com)
- [ ] Integration with Antony's frontend

## Notes

- One branch for backend: Sreya + Shriya both commit to `Sreya` (or a dedicated `backend` branch).
- To add another university later: implement `UniversityDataProvider` and register in `providers/registry.py`.
