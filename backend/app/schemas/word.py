from pydantic import BaseModel


class WordBase(BaseModel):
    text: str
    difficulty_level: int = 1
    pattern_tags: str | None = None


class WordCreate(WordBase):
    pass


class WordRead(WordBase):
    id: int

    class Config:
        orm_mode = True
