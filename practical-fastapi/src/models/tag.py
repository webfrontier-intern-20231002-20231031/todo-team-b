from datetime import datetime
from zoneinfo import ZoneInfo

from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql.expression import text
from sqlalchemy.sql.functions import now
from sqlalchemy.types import TIMESTAMP

from app.database import Base
from models.todo_tag import TodoTagModel

from sqlalchemy.dialects import postgresql



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
        postgresql.TIMESTAMP(timezone=True),
        default=lambda: datetime.now(ZoneInfo("Asia/Tokyo")),
    )

    updated_at: Mapped[datetime] = mapped_column(
        postgresql.TIMESTAMP(timezone=True),
        onupdate=lambda: datetime.now(ZoneInfo("Asia/Tokyo")),
    )
