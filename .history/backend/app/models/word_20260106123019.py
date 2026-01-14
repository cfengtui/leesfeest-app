from sqlalchemy import Column, Integer, String
from app.db.database import Base

class Word(Base):
    __tablename__ = "words"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    difficulty_level = Column(Integer, default=1)  # DMT 1/2/3
    pattern_tags = Column(String, default="")
    