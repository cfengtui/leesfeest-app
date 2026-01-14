from pydantic import BaseModel
from datetime import datetime

class SessionBase(BaseModel):
    user_id: int
    total_words: int
    correct_words: int
    duration_seconds: int

class SessionCreate(SessionBase):
    pass

class SessionRead(SessionBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
