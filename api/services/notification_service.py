import httpx
import logging

from api.config import settings

logger = logging.getLogger(__name__)

TELEGRAM_API_URL = "https://api.telegram.org/bot{token}/sendMessage"


async def send_telegram_message(chat_id: int, text: str) -> bool:
    if not settings.BOT_TOKEN:
        logger.warning("BOT_TOKEN not configured, skipping notification")
        return False

    url = TELEGRAM_API_URL.format(token=settings.BOT_TOKEN)
    payload = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "HTML",
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, timeout=10.0)
            if response.status_code == 200:
                logger.info(f"Notification sent to chat_id={chat_id}")
                return True
            else:
                logger.error(f"Telegram API error: {response.status_code} - {response.text}")
                return False
    except Exception as e:
        logger.error(f"Failed to send notification: {e}")
        return False


async def notify_booking_confirmed(chat_id: int, booking_id: int, service_title: str, date_str: str, time_str: str, note: str | None = None):
    message = (
        "✅ <b>نوبت شما تأیید شد!</b>\n"
        "━━━━━━━━━━━━━━━━━━━\n\n"
        f"🔖 شناسه: <b>#{booking_id}</b>\n"
        f"✨ خدمت: <b>{service_title}</b>\n"
        f"📅 تاریخ: <b>{date_str}</b>\n"
        f"🕐 ساعت: <b>{time_str}</b>\n"
    )
    if note:
        message += f"\n📝 یادداشت: {note}\n"
    message += "\n━━━━━━━━━━━━━━━━━━━\n\nwaiting for you at the salon. 🤝"
    return await send_telegram_message(chat_id, message)


async def notify_booking_rejected(chat_id: int, booking_id: int, service_title: str, date_str: str, time_str: str, note: str | None = None):
    message = (
        "❌ <b>نوبت شما تأیید نشد</b>\n"
        "━━━━━━━━━━━━━━━━━━━\n\n"
        f"🔖 شناسه: <b>#{booking_id}</b>\n"
        f"✨ خدمت: <b>{service_title}</b>\n"
        f"📅 تاریخ: <b>{date_str}</b>\n"
        f"🕐 ساعت: <b>{time_str}</b>\n"
    )
    if note:
        message += f"\n📝 دلیل: {note}\n"
    message += (
        "\n━━━━━━━━━━━━━━━━━━━\n\n"
        "لطفاً زمان دیگری را از ربات رزرو انتخاب کنید."
    )
    return await send_telegram_message(chat_id, message)
