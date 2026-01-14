import os
import sys

# Add the current directory to sys.path so we can import app
sys.path.append(os.getcwd())

from app.db.database import engine, Base
from app.models import User, ReadingSession, Word

print("Attempting to create tables...")
Base.metadata.create_all(bind=engine)
print("Tables created successfully.")

# Check if file was created and has size
db_path = "dmt_db.sqlite"
if os.path.exists(db_path):
    print(f"Database file found: {db_path}")
    print(f"Size: {os.path.getsize(db_path)} bytes")
else:
    print(f"Database file NOT found at {db_path}")
