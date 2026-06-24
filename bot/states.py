from aiogram.filters.state import State, StatesGroup


class BookingStates(StatesGroup):
    idle = State()
    select_service = State()
    select_date = State()
    select_time = State()
    enter_name = State()
    enter_phone = State()
    confirm = State()
