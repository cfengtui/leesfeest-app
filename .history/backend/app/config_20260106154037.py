import os
from pydantic import BaseSettings

# Absolute path for SQLite (optional, makes it consistent on Windows)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

class Settings(BaseSettings):
    database_url: str = f"sqlite:///{os.path.join(BASE_DIR, 'dmt.db')}"
    secret_key: str = "your_secret_key_here"

    class Config:
        # Reads from environment variables if you set them
        env_file = ".env"
        env_file_encoding = "utf-8"

# Instantiate a single settings object
settings = Settings()


