from backend.app.api import user
from fastapi import FastAPI
from app.api import session, word

app = FastAPI(title="DMT Reading Practice API")

# Include routers
app.include_router(user.router)
app.include_router(sessions.router)
app.include_router(words.router)

# Root route
@app.get("/")
def root():
    return {"message": "DMT Practice API is running!"}
