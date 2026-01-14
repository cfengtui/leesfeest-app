from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from ..db.database import get_db
from ..models.session import SessionModel
from ..schemas.session import SessionCreate
from ..models.user import User

router = APIRouter()

@router.post("/", response_model=SessionModel)
def create_session(payload: SessionCreate, session: Session = Depends(get_db)):
    user = session.get(User, payload.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    s = SessionModel(user_id=payload.user_id)
    session.add(s)
    session.commit()
    session.refresh(s)
    return s
