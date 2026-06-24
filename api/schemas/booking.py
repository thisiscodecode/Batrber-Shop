from datetime import date, time, datetime
from pydantic import BaseModel


class BookingCreate(BaseModel):
    telegram_id: int
    name: str
    phone: str
    service_id: int
    date: date
    time: time


class BookingStatusUpdate(BaseModel):
    status: str
    note: str | None = None


class BookingResponse(BaseModel):
    id: int
    user_id: int
    service_id: int
    date: date
    time: time
    status: str
    note: str | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class BookingDetailResponse(BookingResponse):
    user_name: str = ""
    user_phone: str = ""
    telegram_id: int = 0
    service_title: str = ""
    service_duration: int = 0
    service_price: float = 0.0
