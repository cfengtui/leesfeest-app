from pydantic import BaseModel
from datetime import datetime


class SessionCreate(BaseModel):
    user_id: int
    total_words: int
    correct_words: int
    duration_seconds: int


class SessionRead(BaseModel):
    id: int
    user_id: int
    total_words: int
    correct_words: int
    duration_seconds: int
    created_at: datetime

    class Config:
        orm_mode = True
