from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql.expression import text
from sqlalchemy.types import TIMESTAMP

from app.database import Base
from models.tag import TagModel
from models.todo_tag import TodoTagModel


class TodoModel(Base):
    __tablename__ = "todo"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    content: Mapped[str] = mapped_column(String(256), nullable=False)
    completed: Mapped[bool] = mapped_column(
        Boolean, nullable=False, default=False, server_default="False"
    )
    deadline: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    tags: Mapped[list[TagModel]] = relationship(
        TagModel,
        secondary=TodoTagModel.__tablename__,
        back_populates="todos"
    )

    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=text("DATETIME('now', 'localtime')"),
    )

    updated_at: Mapped[datetime] = mapped_column(
        TIMESTAMP(timezone=True),
        nullable=False,
        server_default=text("DATETIME('now', 'localtime')"),
    )
