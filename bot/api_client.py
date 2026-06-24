import httpx
from api.config import settings

API_BASE = f"http://{'localhost:8000' if not settings.WEBHOOK_URL else settings.WEBHOOK_URL.replace('/webhook', '')}/api"


async def get_services() -> list[dict]:
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(f"{API_BASE}/services", timeout=10.0)
            resp.raise_for_status()
            return resp.json()
        except Exception:
            return []


async def create_booking(data: dict) -> dict | None:
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.post(f"{API_BASE}/bookings", json=data, timeout=10.0)
            resp.raise_for_status()
            return resp.json()
        except httpx.HTTPStatusError as e:
            return {"error": e.response.json().get("detail", "خطا در رزرو")}
        except Exception:
            return {"error": "خطا در اتصال به سرور"}


async def get_user_bookings(telegram_id: int) -> list[dict]:
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(f"{API_BASE}/bookings/user/{telegram_id}", timeout=10.0)
            resp.raise_for_status()
            return resp.json()
        except Exception:
            return []
