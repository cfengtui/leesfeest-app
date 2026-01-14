from fastapi import FastAPI
from app.api import users, sessions, words

app = FastAPI()

app.include_router(users.router)
app.include_router(sessions.router)
app.include_router(words.router)

