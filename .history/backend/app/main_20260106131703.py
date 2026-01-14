from fastapi import FastAPI
from app.api import sessions, users, words

app = FastAPI(title="DMT Reading Backend")

app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(words.router, prefix="/words", tags=["words"])
app.include_router(sessions.router, prefix="/sessions", tags=["sessions"])

