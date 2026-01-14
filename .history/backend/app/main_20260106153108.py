from fastapi import FastAPI
from app.api import users, sessions, words

app = FastAPI(title="DMT Reading Practice API")

# Include routers
app.include_router(users.router)
app.include_router(sessions.router)
app.include_router(words.router)

# Root route
@app.get("/")
def root():
    return {"message": "DMT Practice API is running!"}
