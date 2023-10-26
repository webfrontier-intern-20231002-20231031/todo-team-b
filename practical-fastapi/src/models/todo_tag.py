from datetime import datetime
from zoneinfo import ZoneInfo

from sqlalchemy import ForeignKey, Integer
from sqlalchemy.dialects import postgresql
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql.expression import text
from sqlalchemy.types import TIMESTAMP

from app.database import Base


class TodoTagModel(Base):
    __tablename__ = "todo_tag"

    todo_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("todo.id"), primary_key=True
    )
    tag_id: Mapped[int] = mapped_column(Integer, ForeignKey("tag.id"), primary_key=True)

    created_at: Mapped[datetime] = mapped_column(
        postgresql.TIMESTAMP(timezone=True),
        default=lambda: datetime.now(ZoneInfo("Asia/Tokyo")),
    )

    updated_at: Mapped[datetime] = mapped_column(
        postgresql.TIMESTAMP(timezone=True),
        onupdate=lambda: datetime.now(ZoneInfo("Asia/Tokyo")),
    )
