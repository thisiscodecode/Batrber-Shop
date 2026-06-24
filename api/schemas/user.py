from datetime import datetime
from pydantic import BaseModel


class UserResponse(BaseModel):
    id: int
    telegram_id: int
    name: str
    phone: str
    created_at: datetime

    model_config = {"from_attributes": True}
