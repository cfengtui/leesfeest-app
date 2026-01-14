from sqlalchemy import Column, Integer, ForeignKey, JSON, DateTime
from sqlalchemy.sql import func
from app.db.database import Base

class ReadingSession(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    duration_seconds = Column(Integer, default=180)
    total_words = Column(Integer, default=0)
    correct_words = Column(Integer, default=0)
    words_presented = Column(JSON, default=[])
    words_read = Column(JSON, default=[])
    errors = Column(Integer, default=0)
    self_corrections = Column(Integer, default=0)
    wpm = Column(Integer, default=0)
    accuracy = Column(Integer, default=0)
