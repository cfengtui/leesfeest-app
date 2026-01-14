from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from ..db.database import get_session
from ..models.word import Word

router = APIRouter()

@router.get("/")
def list_words(session: Session = Depends(get_session)):
    stmt = select(Word)
    results = session.exec(stmt).all()
    return results
