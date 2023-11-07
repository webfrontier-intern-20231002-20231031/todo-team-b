from fastapi import APIRouter

from api.v1 import tag, todo, user

api_router = APIRouter()

api_router.include_router(todo.router, prefix="/todo", tags=["todo"])
api_router.include_router(tag.router, prefix="/tag", tags=["tag"])
api_router.include_router(user.router, prefix="/user", tags=["user"])
