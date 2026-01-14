from pydantic import BaseSettings
from pathlib import Path

class Settings(BaseSettings):
    database_url: str
    secret_key: str

    class Config:
        env_file = str(Path(__file__).resolve().parents[3] / ".env")
        env_file_encoding = "utf-8"

settings = Settings()

