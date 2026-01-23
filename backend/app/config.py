import os
from pydantic import BaseSettings, Field

# Absolute path for SQLite (optional, makes it consistent on Windows)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

class Settings(BaseSettings):
    # Read DATABASE_URL from environment, fallback to local db for development
    # Render sets DATABASE_URL to sqlite:////data/dmt.db
    database_url: str = Field(
        default=f"sqlite:///{os.path.join(BASE_DIR, 'dmt.db')}",
        env="DATABASE_URL"
    )
    secret_key: str = Field(
        default="your_secret_key_here",
        env="SECRET_KEY"
    )

    class Config:
        # Reads from environment variables if you set them
        env_file = ".env"
        env_file_encoding = "utf-8"

# Instantiate a single settings object
settings = Settings()

# Log the database path on startup (helps debug)
print(f"[Config] Using database: {settings.database_url}")
