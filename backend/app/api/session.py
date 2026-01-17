from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List

from app.db.database import get_db
from app.models.session import ReadingSession
from app.models.user import User
from app.schemas.session import SessionCreate, SessionRead
from app.routers.auth import get_current_user

router = APIRouter(prefix="/session", tags=["session"])


@router.post("/", response_model=SessionRead)
def create_session(
    session_data: SessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Calculate derived stats if not provided? 
    # For now trust the client but overwrite user_id
    
    session = ReadingSession(
        user_id=current_user.id,
        total_words=session_data.total_words,
        correct_words=session_data.correct_words,
        duration_seconds=session_data.duration_seconds,
        errors=session_data.errors,
        self_corrections=session_data.self_corrections,
        wpm=session_data.wpm,
        accuracy=session_data.accuracy,
        words_presented=session_data.words_presented,
        words_read=session_data.words_read,
        created_at=datetime.utcnow()
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    return session


@router.get("/me", response_model=List[SessionRead])
def get_user_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all sessions for the current authenticated user"""
    try:
        sessions = (
            db.query(ReadingSession)
            .filter(ReadingSession.user_id == current_user.id)
            .order_by(ReadingSession.created_at.desc())
            .all()
        )
        return sessions
    except Exception as e:
        import traceback
        print(f"Error fetching user sessions: {str(e)}")
        print(traceback.format_exc())
        # Return empty list instead of crashing
        return []

@router.get("/user/{user_id}", response_model=list[SessionRead])
def get_sessions_for_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Get sessions for a specific user (self, teacher, or admin only)"""
    # Check authorization: must be self, teacher, or admin
    if current_user.id != user_id and current_user.role not in ["admin", "teacher"]:
        raise HTTPException(status_code=403, detail="Not authorized to view other users' sessions")
    
    sessions = (
        db.query(ReadingSession)
        .filter(ReadingSession.user_id == user_id)
        .order_by(ReadingSession.created_at.desc())
        .all()
    )
    return sessions
