from datetime import datetime
from pydantic import BaseModel


class ServiceCreate(BaseModel):
    title: str
    duration: int
    price: float = 0.0
    active: bool = True


class ServiceUpdate(BaseModel):
    title: str | None = None
    duration: int | None = None
    price: float | None = None
    active: bool | None = None


class ServiceResponse(BaseModel):
    id: int
    title: str
    duration: int
    price: float
    active: bool
    created_at: datetime

    model_config = {"from_attributes": True}
