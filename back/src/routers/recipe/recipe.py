from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from ...database.database import get_db
from ...model.model import Recipe

router = APIRouter()

@router.get("/recipes")
def read_all_recipes(db: Session = Depends(get_db)):
    recipes = db.query(Recipe).all()
    return recipes

@router.post("/recipes")
def create_recipe(post_id: int, ingredients: str, instructions: str, db: Session = Depends(get_db)):
    db_recipe = Recipe(post_id=post_id, ingredients=ingredients, instructions=instructions)
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    return db_recipe

@router.get("/recipes/{recipe_id}")
def read_recipe(recipe_id: int, db: Session = Depends(get_db)):
    db_recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if db_recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return db_recipe

@router.put("/recipes/{recipe_id}")
def update_recipe(recipe_id: int, ingredients: str, instructions: str, db: Session = Depends(get_db)):
    db_recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if db_recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    db_recipe.ingredients = ingredients
    db_recipe.instructions = instructions
    db.commit()
    db.refresh(db_recipe)
    return db_recipe

@router.delete("/recipes/{recipe_id}")
def delete_recipe(recipe_id: int, db: Session = Depends(get_db)):
    db_recipe = db.query(Recipe).filter(Recipe.id == recipe_id).first()
    if db_recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found")
    db.delete(db_recipe)
    db.commit()
    return {"message": f"Recipe {recipe_id} deleted"}