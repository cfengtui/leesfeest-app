from pydantic import BaseModel
from datetime import datetime

class SessionBase(BaseModel):
    user_id: int
    total_words: int
    correct_words: int
    duration_seconds: int
    errors: int = 0
    self_corrections: int = 0
    wpm: int = 0
    accuracy: int = 0
    words_presented: list[str] = []
    words_read: list[str] = []

class SessionCreate(SessionBase):
    pass

class SessionRead(SessionBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
