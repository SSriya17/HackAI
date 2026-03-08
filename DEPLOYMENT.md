# Deployment Guide: RA Match

To host this project publicly, we recommend using **Render.com** because it supports both Python (FastAPI) and Static Sites (React/Vite) with an easy-to-use free tier.

## Quick Setup with Render Blueprint

I have added a `render.yaml` file to your root directory. This allows for "Infrastructure as Code" deployment.

1.  **Push your code** to a GitHub repository.
2.  **Go to [Render Dashboard](https://dashboard.render.com/)**.
3.  Click **New +** > **Blueprint**.
4.  Connect your GitHub repository.
5.  Render will automatically detect the `render.yaml` and set up:
    *   The **FastAPI Backend** (Python).
    *   The **React Frontend** (Vite).

## Configuration Checklist

### 1. API Keys (Backend)
After the Blueprint is created, you will need to fill in the following Environment Variables in the Render Dashboard for the `ra-match-api` service:
- `NEBULA_API_KEY`
- `OPENAI_API_KEY`
- `GROQ_API_KEY`
- `GEMINI_API_KEY` (if used)

### 2. CORS (Cross-Origin Resource Sharing)
The backend `render.yaml` currently sets `CORS_ORIGINS` to `*` for easy setup. For better security, you should later change this to your frontend's actual URL (e.g., `https://ra-match-frontend.onrender.com`).

### 3. Persistent Database
By default, the SQLite database (`ra_match.db`) will be reset every time the backend service restarts. 
To keep your data permanently:
1.  In the Render Dashboard, go to the `ra-match-api` service.
2.  Go to **Disks** > **Add Disk**.
3.  Name: `ra-match-data`.
4.  Mount Path: `/opt/render/project/src/backend/data`.
5.  Size: `1GB` (Free tier).
6.  Go to **Environment** and update `DATABASE_URL` to `sqlite+aiosqlite:///./data/ra_match.db`.

---

## Manual Deployment Settings (If you don't use the Blueprint)

### Backend (Web Service)
- **Runtime**: Python
- **Build Command**: `pip install -r backend/requirements.txt`
- **Start Command**: `python -m uvicorn main:app --host 0.0.0.0 --port $PORT` (Run from within `backend` folder)

### Frontend (Static Site)
- **Build Command**: `npm install && npm run build` (Run from within `Antony/frontend`)
- **Publish Directory**: `Antony/frontend/dist`
- **Environment Variable**: `VITE_API_BASE_URL` set to your Backend URL.
