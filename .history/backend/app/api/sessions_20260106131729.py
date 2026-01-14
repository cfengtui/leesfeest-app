from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.session import ReadingSession
from app.models.user import User
from app.core.scoring import score_session

router = APIRouter()

@router.post("/start")
def start_session(user_id: int, db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    session = ReadingSession(user_id=user.id)
    db.add(session)
    db.commit()
    db.refresh(session)
    return {"session_id": session.id, "duration_seconds": session.duration_seconds}

@router.post("/{session_id}/event")
def add_event(session_id: int, word: str, correct: bool, self_corrected: bool = False, db: Session = Depends(get_db)):
    session = db.get(ReadingSession, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session.words_presented.append(word)
    if correct:
        session.words_read.append(word)
    else:
        session.errors += 1
    if self_corrected:
        session.self_corrections += 1

    db.add(session)
    db.commit()
    db.refresh(session)
    return {"message": "Event recorded"}

@router.post("/{session_id}/finish")
def finish_session(session_id: int, db: Session = Depends(get_db)):
    session = db.get(ReadingSession, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    result = score_session(session)
    session.wpm = result["wpm"]
    session.accuracy = result["accuracy"]
    db.add(session)
    db.commit()
    db.refresh(session)
    return {"result": result}

@router.get("/{session_id}/result")
def get_result(session_id: int, db: Session = Depends(get_db)):
    session = db.get(ReadingSession, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return {
        "session_id": session.id,
        "wpm": session.wpm,
        "accuracy": session.accuracy,
        "errors": session.errors,
        "self_corrections": session.self_corrections
    }
