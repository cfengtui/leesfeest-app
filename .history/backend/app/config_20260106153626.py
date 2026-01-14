import os
from pydantic_settings import BaseSettings

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

class Settings(BaseSettings):
    database_url: str = f"sqlite:///{os.path.join(BASE_DIR, 'dmt.db')}"
    secret_key: str = "some_random_secret"

settings = Settings()

