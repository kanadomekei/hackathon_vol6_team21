from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from sqlalchemy.orm import Session
from ...database.database import get_db
from ...model.model import User

router = APIRouter()

@router.post("/ai/analyze_image")
async def analyze_image(file: UploadFile = File(...)):
    contents = await file.read()
    return {"filename": file.filename}


@router.get("/ai/create_recipe")
def create_recipe():
    pass 
    return {"message": "Recipe created"}