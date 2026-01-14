from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.db.database import engine, Base, SessionLocal
from app.models.user import User
from app.models.word import Word

# 1️⃣ Create tables if they don't exist
Base.metadata.create_all(bind=engine)

# 2️⃣ Start a database session
db: Session = SessionLocal()

# 3️⃣ Seed example users
users_data = [
    {"name": "Sophie", "age": 7, "school_group": 3},
    {"name": "Liam", "age": 9, "school_group": 5},
    {"name": "Emma", "age": 11, "school_group": 7},
]

for u in users_data:
    user = User(**u)
    db.add(user)
try:
    db.commit()
    print("✅ Users seeded successfully")
except IntegrityError:
    db.rollback()
    print("⚠ Users already exist, skipped")

# 4️⃣ Seed example DMT words
words_data = [
    {"text": "kat", "difficulty_level": 1, "pattern_tags": "short vowel"},
    {"text": "boom", "difficulty_level": 1, "pattern_tags": "long vowel"},
    {"text": "fiets", "difficulty_level": 2, "pattern_tags": "consonant blend"},
    {"text": "school", "difficulty_level": 2, "pattern_tags": "consonant cluster"},
    {"text": "bibliotheek", "difficulty_level": 3, "pattern_tags": "long word"},
    {"text": "verjaardag", "difficulty_level": 3, "pattern_tags": "compound word"},
]

for w in words_data:
    word = Word(**w)
    db.add(word)
try:
    db.commit()
    print("✅ Words seeded successfully")
except IntegrityError:
    db.rollback()
    print("⚠ Words already exist, skipped")

db.close()
print("✅ Database seeding finished")
