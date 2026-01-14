from app.api import user, session, word
from fastapi import FastAPI
from app.db.database import engine, Base
from app.db.seed import seed_database

app = FastAPI(title="DMT Reading Practice API")

# Create tables and seed data
Base.metadata.create_all(bind=engine)
seed_database()

# Include routers
app.include_router(user.router)
app.include_router(session.router)
app.include_router(word.router)

@app.get("/")
def root():
    return {"message": "DMT Practice API is running!"}