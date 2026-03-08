from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import httpx
import json
import re
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

import random

from app.config import settings
from app.models.db import get_db
from app.models.interview import InterviewSession, InterviewMessage
from app.providers.registry import get_provider

router = APIRouter()

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    professor_name: str = "Dr. Anurag Nagar"
    research_context: str = "Machine Learning, Data Mining, and Air Quality Monitoring"

class ChatResponse(BaseModel):
    message: str
    raw_json: str

@router.post("/interview/chat", response_model=ChatResponse)
async def interview_chat(request: ChatRequest):
    if not settings.groq_api_key:
        raise HTTPException(status_code=500, detail="Groq API key not configured on server")

    system_prompt = f"""You are {request.professor_name}, a Computer Science professor at UTD. 
Your research focuses on {request.research_context}. 
You are interviewing a student for a research assistant position in your lab. 

CRITICAL INSTRUCTIONS FOR INTERVIEW FLOW:
1. This is a back-and-forth verbal interview process.
2. ALWAYS evaluate the student's *previous answer* before asking a new question.
3. Provide brief, constructive feedback or corrections (1-2 sentences) on their answer.
4. After providing feedback, ask EXACTLY ONE relevant follow-up question based on their answer OR ask a new technical question.
5. Wait for the student to answer before proceeding.

YOU MUST RESPOND IN STRICT JSON FORMAT ONLY. No markdown, no text outside the JSON.
Format your response exactly like this:
{{
  "feedback": "Your 1-2 sentence feedback here.",
  "next_question": "Your single specific question here.",
  "sentiment": "Confident" | "Unsure" | "Neutral",
  "technical_accuracy": <number between 0 and 100>
}}"""

    messages_payload = [{"role": "system", "content": system_prompt}]
    for msg in request.messages:
        messages_payload.append({
            "role": "user" if msg.role == "user" else "assistant",
            "content": msg.content
        })

    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": messages_payload,
        "response_format": {"type": "json_object"},
        "temperature": 0.5,
        "max_tokens": 512
    }
    
    headers = {
        "Authorization": f"Bearer {settings.groq_api_key}",
        "Content-Type": "application/json"
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                GROQ_API_URL,
                headers=headers,
                json=payload,
                timeout=15.0
            )
            response.raise_for_status()
            data = response.json()
            
            if "choices" in data and len(data["choices"]) > 0:
                ai_message_raw = data["choices"][0]["message"]["content"]
                
                try:
                    parsed_json = json.loads(ai_message_raw)
                    feedback = parsed_json.get("feedback", "")
                    next_q = parsed_json.get("next_question", "")
                    spoken_message = f"{feedback} {next_q}".strip()
                    
                    if not spoken_message:
                        spoken_message = ai_message_raw
                        
                    return ChatResponse(
                        message=spoken_message, 
                        raw_json=ai_message_raw
                    )
                except json.JSONDecodeError:
                    print("Failed to decode JSON from Groq:", ai_message_raw)
                    return ChatResponse(message=ai_message_raw, raw_json="{}")
            else:
                raise HTTPException(status_code=500, detail="Empty response from Groq")
                
        except httpx.HTTPStatusError as e:
            print(f"Groq API Error: {e.response.text}")
            raise HTTPException(status_code=e.response.status_code, detail=f"Groq API Error: {e.response.text}")
        except Exception as e:
            print(f"Unexpected Error: {e}")
            raise HTTPException(status_code=500, detail=str(e))

class SaveInterviewRequest(BaseModel):
    user_id: str = "guest"
    professor_name: str
    messages: List[ChatMessage]

@router.post("/interview/save")
async def save_interview(request: SaveInterviewRequest, db: AsyncSession = Depends(get_db)):
    try:
        session = InterviewSession(user_id=request.user_id, professor_name=request.professor_name)
        db.add(session)
        await db.flush() # to get session.id

        for msg in request.messages:
            db_msg = InterviewMessage(
                session_id=session.id,
                role=msg.role,
                content=msg.content
            )
            db.add(db_msg)
        
        await db.commit()
        return {"status": "success", "session_id": session.id}
    except Exception as e:
        await db.rollback()
        print(f"Error saving interview: {e}")
        raise HTTPException(status_code=500, detail=str(e))

class InterviewHistoryResponse(BaseModel):
    id: int
    professor_name: str
    created_at: datetime
    message_count: int

@router.get("/interview/history", response_model=List[InterviewHistoryResponse])
async def get_interview_history(user_id: str = "guest", db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(
            select(InterviewSession).where(InterviewSession.user_id == user_id).order_by(InterviewSession.created_at.desc())
        )
        sessions = result.scalars().all()
        
        history = []
        for s in sessions:
            # count messages lazy-loaded or just default if we don't query
            # for now let's just use the loaded relationship
            await db.refresh(s, ["messages"])
            history.append({
                "id": s.id,
                "professor_name": s.professor_name,
                "created_at": s.created_at,
                "message_count": len(s.messages)
            })
            
        return history
    except Exception as e:
        print(f"Error getting history: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/interview/professors")
async def get_interview_professors(limit: int = 10):
    """Return professors for interview prep (from raw/Nebula). Use when student has no matches."""
    provider = get_provider("utd")
    if not provider:
        return []
    try:
        profs = await provider.search_professors("", limit=max(20, limit * 2))
        random.shuffle(profs)
        result = []
        for p in profs[:limit]:
            courses = p.courses or []
            course_strs = [f"{c.subject_prefix} {c.course_number}" for c in courses[:3] if c.subject_prefix]
            research = ", ".join(course_strs) or "Computer Science research"
            result.append({
                "professor_id": p.id,
                "professor_name": p.full_name,
                "research_context": research,
            })
        return result
    except Exception as e:
        print(f"Error fetching interview professors: {e}")
        return []


@router.get("/interview/history/{session_id}")
async def get_interview_session(session_id: int, db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(
            select(InterviewSession).where(InterviewSession.id == session_id)
        )
        session = result.scalars().first()
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
            
        await db.refresh(session, ["messages"])
        return {
            "id": session.id,
            "professor_name": session.professor_name,
            "created_at": session.created_at,
            "messages": [{"role": m.role, "content": m.content, "created_at": m.created_at} for m in session.messages]
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting session: {e}")
        raise HTTPException(status_code=500, detail=str(e))
