from datetime import datetime
from sqlalchemy import Integer, String, SmallInteger, Numeric, Boolean, TIMESTAMP, func
from sqlalchemy.orm import Mapped, mapped_column

from api.database import Base


class Service(Base):
    __tablename__ = "services"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    duration: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False, default=0.0)
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now())
