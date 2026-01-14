from fastapi import FastAPI
from .db.database import init_db
from .api import users, sessions, words

app = FastAPI(title="DMT App Backend")

app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(sessions.router, prefix="/sessions", tags=["sessions"])
app.include_router(words.router, prefix="/words", tags=["words"])


@app.on_event("startup")
def on_startup():
    init_db()
