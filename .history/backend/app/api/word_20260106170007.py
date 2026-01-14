from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.word import Word
from app.schemas.word import WordRead

router = APIRouter(prefix="/word", tags=["word"])

@router.get("/", response_model=list[WordRead])
def list_words(level: int = Query(None), db: Session = Depends(get_db)):
    query = db.query(Word)
    if level:
        query = query.filter(Word.difficulty_level == level)
    return query.all()

@router.get("/{word_id}", response_model=WordRead)
def get_word(word_id: int, db: Session = Depends(get_db)):
    return db.query(Word).filter(Word.id == word_id).first()