from app.api import user, session, word
from fastapi import FastAPI
from app.db.database import engine, Base
from app.db import seed

app = FastAPI(title="DMT Reading Practice API")

# 1️⃣ Create all tables
Base.metadata.create_all(bind=engine)

# 2️⃣ Seed the database on startup
seed.db.query(seed.User).count() == 0 and seed.db.close()  # Clear old session
from app.db.seed import db as seed_db
seed_db.close()

# Include routers
app.include_router(user.router)
app.include_router(session.router)
app.include_router(word.router)

# Root route
@app.get("/")
def root():
    return {"message": "DMT Practice API is running!"}