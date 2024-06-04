from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database.database import initialize_data

from .routers.users.user import router as user_router
from .routers.post.post import router as post_router
from .routers.comment.comment import router as comment_router
from .routers.like.like import router as like_router
from .routers.ai.ai import router as ai_router

app = FastAPI()

app.include_router(user_router)
app.include_router(post_router)
app.include_router(comment_router)
app.include_router(like_router)
app.include_router(ai_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    initialize_data()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.main:app", host="0.0.0.0", port=8080, reload=True)