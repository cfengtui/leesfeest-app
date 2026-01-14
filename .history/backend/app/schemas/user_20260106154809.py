# backend/app/schemas/user.py
from pydantic import BaseModel

# Schema for creating a new user (POST request)
class UserCreate(BaseModel):
    name: str
    age: int
    school_group: int

# Schema for reading user data (GET response)
class UserRead(BaseModel):
    id: int
    name: str
    age: int
    school_group: int

    class Config:
        orm_mode = True  # Allows SQLAlchemy models to be converted automatically
