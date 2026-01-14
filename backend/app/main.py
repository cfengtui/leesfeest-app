from app.api import user, session, word, speech
from app.routers import auth
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import engine, Base
from app.db.seed import seed_database
import time
from collections import deque
from app.models import User, ReadingSession, Word

app = FastAPI(title="Leesfeest - Technisch Lezen & Spelling")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple in-memory stats (for demo purposes)
# In production, use Prometheus or a real DB table
LATENCY_HISTORY = deque(maxlen=100)
REQUEST_COUNT = 0

@app.middleware("http")
async def track_latency(request: Request, call_next):
    global REQUEST_COUNT
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    LATENCY_HISTORY.append(process_time)
    REQUEST_COUNT += 1
    return response

# Ensure tables are created on startup (with models registered)
Base.metadata.create_all(bind=engine)
# # seed_database()

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# Include routers
app.include_router(user.router)
app.include_router(session.router)
app.include_router(word.router)
app.include_router(auth.router)
app.include_router(speech.router)

# Mount separate static folder first to avoid conflict with root catch-all if needed
# But here we just want to serve the single file app
app.mount("/static", StaticFiles(directory="../frontend_portable"), name="static")

@app.get("/")
async def read_index():
    return FileResponse("../frontend_portable/index.html")

@app.get("/stats")
def get_system_stats():
    avg_latency = sum(LATENCY_HISTORY) / len(LATENCY_HISTORY) if LATENCY_HISTORY else 0
    return {
        "total_requests": REQUEST_COUNT,
        "avg_latency": round(avg_latency, 4),
        "active_users_mock": 42, # Mock for demo
    }