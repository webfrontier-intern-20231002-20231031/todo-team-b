from datetime import datetime

from pydantic import BaseModel, ConfigDict


class TodoSchemaBase(BaseModel):
    completed: bool | None = None
    deadline: datetime | None = None
    model_config = ConfigDict(from_attributes=True)


class TagSchemaBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class UserSchema(BaseModel):
    email: str | None = None
    password: str | None = None


class TodoTagSchema(TagSchemaBase):
    id: int | None = None
    name: str | None = None


class TagTodoSchema(TodoSchemaBase):
    id: int
    content: str


class TodoSchema(TagTodoSchema):
    tags: list[TodoTagSchema] | None = []


class CreateTodoSchema(TodoSchemaBase):
    content: str
    tags: list[TodoTagSchema] | None = []


class UpdateTodoSchema(TodoSchemaBase):
    content: str | None = None
    tags: list[TodoTagSchema] | None = []


class TagSchema(TodoTagSchema):
    todos: list[TagTodoSchema] | None = []


class CreateUpdateTagSchema(TagSchemaBase):
    name: str


# 更新の処理を実装する際に利用する
# class UpdateUserSchema(UserSchema):
#     username: str | None = None
