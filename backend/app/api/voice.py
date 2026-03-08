import asyncio
import json
import websockets
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.config import settings

router = APIRouter()

GEMINI_WS_URL = "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent"

@router.websocket("/voice")
async def voice_proxy(websocket: WebSocket):
    await websocket.accept()
    print("Frontend WebSocket connected to proxy")
    
    print(f"Checking GEMINI_API_KEY: {settings.gemini_api_key[:5]}...")
    if not settings.gemini_api_key or "your_gemini" in settings.gemini_api_key:
        print("Error: GEMINI_API_KEY not configured")
        await websocket.send_text(json.dumps({"error": "GEMINI_API_KEY not configured on server. Please check backend/.env"}))
        await websocket.close()
        return

    gemini_url = f"{GEMINI_WS_URL}?key={settings.gemini_api_key}"
    print(f"Connecting to Gemini at: {GEMINI_WS_URL} (key hidden)")
    
    try:
        async with websockets.connect(gemini_url) as gemini_ws:
            print("Connected to Gemini Live API")
            
            async def forward_to_gemini():
                try:
                    while True:
                        message = await websocket.receive_text()
                        # print(f"Forwarding to Gemini: {message[:100]}...")
                        await gemini_ws.send(message)
                except WebSocketDisconnect:
                    print("Frontend disconnected")
                except Exception as e:
                    print(f"Error forwarding to Gemini: {e}")

            async def forward_to_frontend():
                try:
                    while True:
                        message = await gemini_ws.recv()
                        print(f"Received from Gemini: {message[:200]}...")
                        await websocket.send_text(message)
                except Exception as e:
                    print(f"Error forwarding to Frontend: {e}")

            # Run both tasks and wait for either to finish
            done, pending = await asyncio.wait(
                [asyncio.create_task(forward_to_gemini()), 
                 asyncio.create_task(forward_to_frontend())],
                return_when=asyncio.FIRST_COMPLETED
            )
            
            for task in pending:
                task.cancel()
            
            print("Voice proxy session ended")
            
    except Exception as e:
        print(f"Voice Proxy Error: {e}")
        await websocket.send_text(json.dumps({"error": f"Gemini Connection Error: {str(e)}"}))
    finally:
        try:
            await websocket.close()
        except:
            pass
