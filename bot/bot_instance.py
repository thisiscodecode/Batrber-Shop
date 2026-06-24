from aiogram import Bot, Dispatcher
from aiogram.fsm.storage.memory import MemoryStorage

from api.config import settings


def create_bot() -> Bot:
    return Bot(token=settings.BOT_TOKEN)


def create_dispatcher() -> Dispatcher:
    storage = MemoryStorage()
    return Dispatcher(storage=storage)
