import asyncio
import logging
from aiogram import Bot
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode

from bot.bot_instance import create_bot, create_dispatcher
from bot.handlers import router
from api.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def main():
    if not settings.BOT_TOKEN:
        logger.error("BOT_TOKEN is not set. Bot cannot start.")
        return

    bot = Bot(token=settings.BOT_TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
    dp = create_dispatcher()
    dp.include_router(router)

    logger.info("Bot starting with polling...")

    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
