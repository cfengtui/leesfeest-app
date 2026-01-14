from typing import Optional
from sqlmodel import SQLModel, Field

class SessionModel(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int
    active: bool = True
