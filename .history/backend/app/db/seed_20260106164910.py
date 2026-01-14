from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.db.database import engine, Base, SessionLocal
from app.models.user import User
from app.models.word import Word

def seed_database():
    """Seed the database with initial data"""
    
    # 1️⃣ Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    # 2️⃣ Start a database session
    db: Session = SessionLocal()
    
    try:
        # 3️⃣ Seed example users
        users_data = [
            {"name": "Sophie", "age": 7, "school_group": 3},
            {"name": "Liam", "age": 9, "school_group": 5},
            {"name": "Emma", "age": 11, "school_group": 7},
        ]
        
        for u in users_data:
            existing = db.query(User).filter(User.name == u["name"]).first()
            if not existing:
                user = User(**u)
                db.add(user)
        
        db.commit()
        print("✅ Users seeded successfully")
        
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
            existing = db.query(Word).filter(Word.text == w["text"]).first()
            if not existing:
                word = Word(**w)
                db.add(word)
        
        db.commit()
        print("✅ Words seeded successfully")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Seeding error: {e}")
    finally:
        db.close()
        print("✅ Database seeding finished")

# Only run if executed directly
if __name__ == "__main__":
    seed_database()