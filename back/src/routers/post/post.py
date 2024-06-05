import os
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from fastapi import UploadFile, File
from ...database.database import get_db
from ...model.model import Post
from ...crud.minio_crud import upload_file_to_minio
import shutil

router = APIRouter()

@router.get("/posts")
def read_all_posts(db: Session = Depends(get_db)):
    posts = db.query(Post).all()
    return posts

@router.post("/posts")
def create_post(user_id: int, caption: str, file: UploadFile = File(...), db: Session = Depends(get_db)):
    # MinIOの設定
    minio_endpoint = os.getenv('MINIO_ENDPOINT', 'http://minio:9000')
    minio_access_key = os.getenv('MINIO_ACCESS_KEY', 'minio')
    minio_secret_key = os.getenv('MINIO_SECRET_KEY', 'minio123')
    bucket_name = 'mybucket'
    
    # ファイルを一時ディレクトリに保存
    file_path = f"/tmp/{file.filename}"
    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())
    
    # MinIOにファイルをアップロード
    object_name = file.filename
    image_url = upload_file_to_minio(file_path, bucket_name, object_name, minio_endpoint, minio_access_key, minio_secret_key)
    
    # データベースに新しい投稿を作成
    new_post = Post(user_id=user_id, caption=caption, image_url=image_url)
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    
    # 一時ファイルを削除
    os.remove(file_path)
    
    return new_post

@router.get("/posts/{post_id}")
def read_post(post_id: int, db: Session = Depends(get_db)):
    db_post = db.query(Post).filter(Post.id == post_id).first()
    if db_post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return db_post

@router.put("/posts/{post_id}")
def update_post(post_id: int, caption: str, file: UploadFile = File(...), db: Session = Depends(get_db)):
    db_post = db.query(Post).filter(Post.id == post_id).first()
    if db_post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # MinIOの設定
    minio_endpoint = os.getenv('MINIO_ENDPOINT', 'http://minio:9000')
    minio_access_key = os.getenv('MINIO_ACCESS_KEY', 'minio')
    minio_secret_key = os.getenv('MINIO_SECRET_KEY', 'minio123')
    bucket_name = 'mybucket'
    
    # ファイルを一時ディレクトリに保存
    file_path = f"/tmp/{file.filename}"
    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())
    
    # MinIOにファイルをアップロード
    object_name = file.filename
    image_url = upload_file_to_minio(file_path, bucket_name, object_name, minio_endpoint, minio_access_key, minio_secret_key)
    
    # データベースの投稿を更新
    db_post.image_url = image_url
    db_post.caption = caption
    db.commit()
    db.refresh(db_post)
    
    # 一時ファイルを削除
    os.remove(file_path)
    
    return db_post

@router.delete("/posts/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db)):
    db_post = db.query(Post).filter(Post.id == post_id).first()
    if db_post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    db.delete(db_post)
    db.commit()
    return {"message": f"Post {post_id} deleted"}