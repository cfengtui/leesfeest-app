from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User          # SQLAlchemy model
from app.schemas.user import UserCreate, UserRead  # Pydantic models

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/", response_model=UserRead)
def cr

