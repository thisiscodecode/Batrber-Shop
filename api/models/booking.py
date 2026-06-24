from datetime import datetime, date, time
from sqlalchemy import Integer, String, Date, Time, Text, TIMESTAMP, ForeignKey, Index, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from api.database import Base


class Booking(Base):
    __tablename__ = "bookings"
    __table_args__ = (
        Index("idx_bookings_date_time_service", "date", "time", "service_id"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    service_id: Mapped[int] = mapped_column(Integer, ForeignKey("services.id"), nullable=False)
    date: Mapped[date] = mapped_column(Date, nullable=False)
    time: Mapped[time] = mapped_column(Time, nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="pending")
    note: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", backref="bookings")
    service = relationship("Service", backref="bookings")
