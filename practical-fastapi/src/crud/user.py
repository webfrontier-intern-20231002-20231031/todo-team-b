from sqlalchemy.orm import Session

from models.user import UserModel
from schemas.schema import UserSchema


def create(db: Session, create_user_schema: UserSchema) -> UserModel:
    user_model = UserModel(**create_user_schema.model_dump())
    db.add(user_model)
    db.commit()
    db.refresh(user_model)
    return user_model
