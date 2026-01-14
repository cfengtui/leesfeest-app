from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    secret_key: str

    model_config = {
        "env_file": ".env",  # now relative to backend/app/
        "env_file_encoding": "utf-8",
    }

settings = Settings()


