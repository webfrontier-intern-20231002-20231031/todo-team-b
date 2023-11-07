from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app import database
from crud import user
from models.user import UserModel
from schemas.schema import UserSchema

router = APIRouter()


# ユーザ情報登録に関する処理
@router.post("/")
def create(user_schema: UserSchema, db: Session = Depends(database.get_db)):
    user_model = (
        db.query(UserModel).filter(UserModel.email == user_schema.email).first()
    )
    if user_model:
        raise HTTPException(status_code=401, detail="Error")
    user.create(db, user_schema)


# ログイン処理
@router.post("/login")
def login(user_schema: UserSchema, db: Session = Depends(database.get_db)):
    user_account = (
        db.query(UserModel).filter(UserModel.email == user_schema.email).first()
    )
    if not user_account:
        raise HTTPException(status_code=401, detail="Error")
    if user_schema.password != user_account.password:
        raise HTTPException(status_code=401, detail="Error")
    return user_account.userid
