from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from ..db.database import get_db
from ..models.user import User
from ..schemas.user import UserCreate

router = APIRouter()

@router.post("/", response_model=User)
def create_user(payload: UserCreate, session: Session = Depends(get_db)):
    user = User(name=payload.name, email=payload.email)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@router.get("/{user_id}", response_model=User)
def get_user(user_id: int, session: Session = Depends(get_db)):
    u = session.get(User, user_id)
    if not u:
        raise HTTPException(status_code=404, detail="User not found")
    return u
