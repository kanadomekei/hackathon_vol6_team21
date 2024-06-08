from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from sqlalchemy.orm import Session
from ...database.database import get_db
from ...model.model import User
from ...LLM.chatgpt import explain_dish
import json

router = APIRouter()

@router.post("/ai/analyze_image")
async def analyze_image(file: UploadFile = File(...)):
    contents = await file.read()
    return {"filename": file.filename}


@router.post("/ai/create_recipe")
def create_recipe(img: UploadFile = File(...)):
    img_path = f"/tmp/{img.filename}"
    with open(img_path, "wb") as buffer:
        buffer.write(img.file.read())

    response_text = explain_dish(img_path)
    try:
        response_json = json.loads(response_text)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to decode JSON response from OpenAI")

    return response_json