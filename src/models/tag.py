from datetime import datetime

from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql.expression import text
from sqlalchemy.types import TIMESTAMP

from app.database import Base
from models.todo_tag import TodoTagModel


class TagModel(Base):
    __tablename__ = "tag"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(32), nullable=False, unique=True)
    todos: Mapped[list["TodoModel"]] = relationship(
        "TodoModel",
        secondary=TodoTagModel.__tablename__,
        back_populates="tags"
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
