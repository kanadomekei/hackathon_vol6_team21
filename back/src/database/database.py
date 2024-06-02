from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from ..model.model import Base

MYSQL_USER = os.getenv('MYSQL_USER', 'mysql')
MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD', 'mysql') 
MYSQL_HOST = os.getenv('MYSQL_HOST', 'hackathon_vol6_team21-db-1')
MYSQL_PORT = os.getenv('MYSQL_PORT', '3306')
MYSQL_DATABASE = os.getenv('MYSQL_DATABASE', 'mysql_study')

DATABASE_URL = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def initialize_data():
    Base.metadata.create_all(bind=engine) 
    #db = SessionLocal()
    #guest_user = User(username="guest", email="guest@example.com", password_hash="hashed_password_here")
    #db.add(guest_user)
    #db.commit()
    #db.close()
    return "Initialization complete with guest user."