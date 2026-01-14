from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.word import Word
from app.schemas.word import WordRead

router = APIRouter(prefix="/words", tags=["words"])


@router.get("/", response_model=list[WordRead])
def get_words(
    level: int = Query(..., ge=1, le=8),
    limit: int = Query(50, ge=10, le=300),
    db: Session = Depends(get_db)
):
    words = (
        db.query(Word)
        .filter(Word.level == level)
        .limit(limit)
        .all()
    )
    return words
