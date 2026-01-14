from app.db.database import SessionLocal, Base, engine
from app.models.user import User
from app.core.security import get_password_hash

# Create tables
Base.metadata.create_all(bind=engine)

# Test user creation
db = SessionLocal()
try:
    u = User(
        email='test@test.com',
        hashed_password=get_password_hash('123456'),
        name='test',
        role='student',
        school_group=6
    )
    db.add(u)
    db.commit()
    print('SUCCESS: User created')
except Exception as e:
    import traceback
    print(f'Error: {e}')
    traceback.print_exc()
finally:
    db.close()
