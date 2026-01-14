# backend/app/schemas/user.py
from pydantic import BaseModel, EmailStr
from typing import Optional

# Schema for creating a new user (POST request)
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    age: Optional[int] = None
    school_group: int
    role: str = "student"

# Schema for reading user data (GET response)
class UserRead(BaseModel):
    id: int
    name: str
    email: EmailStr
    school_group: int
    role: str

    class Config:
        orm_mode = True
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
