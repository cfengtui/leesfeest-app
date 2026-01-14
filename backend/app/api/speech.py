"""
Speech-to-Text WebSocket Proxy for Deepgram
Keeps API key secure on the server side
"""
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import websockets
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api/speech", tags=["speech"])

DEEPGRAM_API_KEY = os.getenv("DEEPGRAM_API_KEY", "")
DEEPGRAM_URL = "wss://api.deepgram.com/v1/listen?model=nova-2&language=nl&smart_format=true&interim_results=false"


@router.websocket("/transcribe")
async def websocket_transcribe(websocket: WebSocket):
    """
    WebSocket endpoint that proxies audio to Deepgram.
    Client sends audio chunks, we forward to Deepgram and send back transcripts.
    """
    await websocket.accept()
    
    if not DEEPGRAM_API_KEY:
        await websocket.send_json({"error": "Deepgram API key not configured"})
        await websocket.close()
        return
    
    deepgram_ws = None
    
    try:
        # Connect to Deepgram with API key in header
        extra_headers = {
            "Authorization": f"Token {DEEPGRAM_API_KEY}"
        }
        
        deepgram_ws = await websockets.connect(
            DEEPGRAM_URL,
            extra_headers=extra_headers
        )
        
        print("[Speech] Connected to Deepgram")
        
        async def forward_to_client():
            """Forward Deepgram responses to client"""
            try:
                async for message in deepgram_ws:
                    await websocket.send_text(message)
            except Exception as e:
                print(f"[Speech] Deepgram receive error: {e}")
        
        async def forward_to_deepgram():
            """Forward client audio to Deepgram"""
            try:
                while True:
                    data = await websocket.receive_bytes()
                    await deepgram_ws.send(data)
            except WebSocketDisconnect:
                print("[Speech] Client disconnected")
            except Exception as e:
                print(f"[Speech] Client receive error: {e}")
        
        # Run both directions concurrently
        await asyncio.gather(
            forward_to_client(),
            forward_to_deepgram(),
            return_exceptions=True
        )
        
    except Exception as e:
        print(f"[Speech] Connection error: {e}")
        try:
            await websocket.send_json({"error": str(e)})
        except:
            pass
    finally:
        if deepgram_ws:
            await deepgram_ws.close()
        print("[Speech] Connection closed")


@router.get("/health")
async def speech_health():
    """Check if speech service is configured"""
    return {
        "status": "ok" if DEEPGRAM_API_KEY else "not_configured",
        "has_api_key": bool(DEEPGRAM_API_KEY)
    }
