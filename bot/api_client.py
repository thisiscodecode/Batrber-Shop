import httpx
from api.config import settings

API_BASE = f"{settings.API_URL.rstrip('/')}/api"


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
            detail = e.response.json().get("detail", "خطا در رزرو")
            if isinstance(detail, list):
                detail = detail[0].get("msg", "خطا در رزرو") if detail else "خطا در رزرو"
            return {"error": detail}
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
