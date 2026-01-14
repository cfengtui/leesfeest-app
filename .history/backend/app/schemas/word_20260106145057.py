from pydantic import BaseModel


class WordBase(BaseModel):
    text: str
    language: str | None = None


class WordCreate(WordBase):
    pass


class WordRead(WordBase):
    id: int

    class Config:
        orm_mode = True
