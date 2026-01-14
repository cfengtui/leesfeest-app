from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.db.database import get_db
from app.models.session import ReadingSession
from backend.app.models.user import User
from app.schemas.session import SessionCreate, SessionRead

router = APIRouter(prefix="/sessions", tags=["sessions"])


@router.post("/", response_model=SessionRead)
def create_session(
    session_data: SessionCreate,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == session_data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    session = ReadingSession(
        user_id=session_data.user_id,
        total_words=session_data.total_words,
        correct_words=session_data.correct_words,
        duration_seconds=session_data.duration_seconds,
        created_at=datetime.utcnow()
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    return session


@router.get("/user/{user_id}", response_model=list[SessionRead])
def get_sessions_for_user(user_id: int, db: Session = Depends(get_db)):
    sessions = (
        db.query(ReadingSession)
        .filter(ReadingSession.user_id == user_id)
        .order_by(ReadingSession.created_at.desc())
        .all()
    )
    return sessions
