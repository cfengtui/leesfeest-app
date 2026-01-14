from sqlmodel import SQLModel, Session, create_engine
from app.config import settings

engine = create_engine(settings.database_url, echo=True)

def get_db():
    with Session(engine) as session:
        yield session

