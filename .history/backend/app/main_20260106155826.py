from app.api import user
from fastapi import FastAPI
from app.api import session, word

app = FastAPI(title="DMT Reading Practice API")

# Include routers
app.include_router(user.router)
app.include_router(session.router)
app.include_router(word.router)

# Root route
@app.get("/")
def root():
    return {"message": "DMT Practice API is running!"}
