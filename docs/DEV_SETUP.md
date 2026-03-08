# Dev Setup: Frontend + Backend

## Quick Start

```bash
npm install          # Install root deps (concurrently)
npm run dev          # Start both backend and frontend
```

## Environment Variables

### Frontend (`Antony/frontend/.env`)

- `VITE_API_BASE_URL` – Backend base URL (default: `http://localhost:8000`). Used for all API calls.

### Backend (`backend/.env`)

- `CORS_ORIGINS` – Comma-separated allowed origins (default: `http://localhost:5173,http://localhost:5174,http://localhost:3000`). Use `*` to allow all (development only).

## Paths

- **Frontend**: `Antony/frontend`
- **Backend**: `backend`

## Dependencies

Install root deps:

```bash
npm install
```

Install backend Python deps (from project root):

```bash
cd backend && pip install -r requirements.txt
```

Frontend deps are installed when running from `Antony/frontend`:

```bash
cd Antony/frontend && npm install
```
