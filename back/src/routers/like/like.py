from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from ...database.database import get_db
from ...model.model import Like

router = APIRouter()

@router.get("/likes")
def read_all_likes(db: Session = Depends(get_db)):
    likes = db.query(Like).all()
    return likes

@router.get("/likes/{post_id}")
def read_likes_list(post_id: int, db: Session = Depends(get_db)):
    likes = db.query(Like).filter_by(post_id=post_id).all()
    return likes

@router.get("/likes/{post_id}/count")
def read_likes_count(post_id: int, db: Session = Depends(get_db)):
    likes = db.query(Like).filter_by(post_id=post_id).all()
    likes_count = len(likes)
    return {"likes_count": likes_count}

@router.post("/likes")
def create_like(post_id: int, user_id: int, db: Session = Depends(get_db)):
    db_like = Like(post_id=post_id, user_id=user_id)
    db.add(db_like)
    db.commit()
    db.refresh(db_like)
    return db_like

@router.get("/likes/{like_id}")
def read_like(like_id: int, db: Session = Depends(get_db)):
    db_like = db.query(Like).filter(Like.id == like_id).first()
    if db_like is None:
        raise HTTPException(status_code=404, detail="Like not found")
    return db_like

@router.delete("/likes/{like_id}")
def delete_like(like_id: int, db: Session = Depends(get_db)):
    db_like = db.query(Like).filter(Like.id == like_id).first()
    if db_like is None:
        raise HTTPException(status_code=404, detail="Like not found")
    db.delete(db_like)
    db.commit()
    return {"message": f"Like {like_id} deleted"}