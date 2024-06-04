from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from fastapi import UploadFile, File
from ...database.database import get_db
from ...model.model import Post

router = APIRouter()

@router.get("/posts")
def read_all_posts(db: Session = Depends(get_db)):
    posts = db.query(Post).all()
    return posts

@router.post("/posts")
def create_post(user_id: int, caption: str, file: UploadFile = File(...), db: Session = Depends(get_db)):
    new_post = Post(user_id=user_id, caption=caption, image_url=file.filename)
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post

@router.get("/posts/{post_id}")
def read_post(post_id: int, db: Session = Depends(get_db)):
    db_post = db.query(Post).filter(Post.id == post_id).first()
    if db_post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return db_post

@router.put("/posts/{post_id}")
def update_post(post_id: int, image_url: str, caption: str, db: Session = Depends(get_db)):
    db_post = db.query(Post).filter(Post.id == post_id).first()
    if db_post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    db_post.image_url = image_url
    db_post.caption = caption
    db.commit()
    db.refresh(db_post)
    return db_post

@router.delete("/posts/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db)):
    db_post = db.query(Post).filter(Post.id == post_id).first()
    if db_post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    db.delete(db_post)
    db.commit()
    return {"message": f"Post {post_id} deleted"}