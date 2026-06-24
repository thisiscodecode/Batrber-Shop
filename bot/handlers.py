from datetime import datetime, timedelta
from aiogram import Router, F
from aiogram.types import Message, CallbackQuery, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.filters import Command
from aiogram.fsm.context import FSMContext

from bot.states import BookingStates
from bot.api_client import get_services, create_booking, get_user_bookings

router = Router()

WEEKDAY_MAP = {0: "دوشنبه", 1: "سه‌شنبه", 2: "چهارشنبه", 3: "پنجشنبه", 4: "جمعه", 5: "شنبه", 6: "یکشنبه"}
MONTH_MAP = {1: "ژانویه", 2: "فوریه", 3: "مارس", 4: "آوریل", 5: "مه", 6: "ژوئن", 7: "ژوئیه", 8: "اوت", 9: "سپتامبر", 10: "اکتبر", 11: "نوامبر", 12: "دسامبر"}

STATUS_LABELS = {
    "pending": "در انتظار",
    "confirmed": "تأیید شده",
    "rejected": "رد شده",
    "cancelled": "لغو شده",
}


@router.message(Command("start"))
async def cmd_start(message: Message, state: FSMContext):
    await state.clear()
    text = (
        "به <b>BookEase Barber</b> خوش آمدید! ✂️\n\n"
        "اینجا می‌توانید برای کوتاهی، فید، اصلاح صورت و خدمات مراقبتی آرایشگاه نوبت بگیرید.\n\n"
        "برای رزرو نوبت جدید از /book استفاده کنید.\n"
        "برای مشاهده رزروهای خود از /mybookings استفاده کنید.\n"
        "برای لغو عملیات فعلی از /cancel استفاده کنید."
    )
    await message.answer(text)


@router.message(Command("book"))
async def cmd_book(message: Message, state: FSMContext):
    services = await get_services()
    if not services:
        await message.answer("در حال حاضر خدمتی موجود نیست. لطفاً بعداً تلاش کنید.")
        return

    await state.set_state(BookingStates.select_service)
    await state.update_data(services=services)

    keyboard_rows = []
    for svc in services:
        keyboard_rows.append([
            InlineKeyboardButton(
                text=f"{svc['title']} - {svc['price']:,.0f} تومان ({svc['duration']} دقیقه)",
                callback_data=f"svc_{svc['id']}",
            )
        ])

    kb = InlineKeyboardMarkup(inline_keyboard=keyboard_rows)
    await message.answer("لطفاً خدمت مورد نظر خود را انتخاب کنید:", reply_markup=kb)


@router.callback_query(F.data.startswith("svc_"), BookingStates.select_service)
async def select_service(callback: CallbackQuery, state: FSMContext):
    service_id = int(callback.data.split("_")[1])
    data = await state.get_data()
    services = data.get("services", [])
    selected = next((s for s in services if s["id"] == service_id), None)

    if not selected:
        await callback.answer("خدمت نامعتبر است")
        return

    await state.update_data(service_id=service_id, service_title=selected["title"], service_duration=selected["duration"], service_price=selected["price"])
    await state.set_state(BookingStates.select_date)
    await callback.answer()

    today = datetime.now().date()
    keyboard_rows = []
    for i in range(1, 8):
        d = today + timedelta(days=i)
        label = f"{WEEKDAY_MAP[d.weekday()]} {d.day} {MONTH_MAP[d.month]}"
        keyboard_rows.append([
            InlineKeyboardButton(text=label, callback_data=f"date_{d.isoformat()}"),
        ])

    kb = InlineKeyboardMarkup(inline_keyboard=keyboard_rows)
    await callback.message.edit_text(
        f"خدمت انتخاب‌شده: <b>{selected['title']}</b>\n\nلطفاً تاریخ را انتخاب کنید:",
        reply_markup=kb,
    )


@router.callback_query(F.data.startswith("date_"), BookingStates.select_date)
async def select_date(callback: CallbackQuery, state: FSMContext):
    date_str = callback.data.split("_", 1)[1]
    await state.update_data(date=date_str)
    await state.set_state(BookingStates.select_time)
    await callback.answer()

    hours = [f"{h:02d}:00" for h in range(9, 18)]
    keyboard_rows = []
    row = []
    for h in hours:
        row.append(InlineKeyboardButton(text=h, callback_data=f"time_{h}"))
        if len(row) == 3:
            keyboard_rows.append(row)
            row = []
    if row:
        keyboard_rows.append(row)

    kb = InlineKeyboardMarkup(inline_keyboard=keyboard_rows)
    await callback.message.edit_text(
        f"تاریخ: <b>{date_str}</b>\n\nلطفاً ساعت را انتخاب کنید:",
        reply_markup=kb,
    )


@router.callback_query(F.data.startswith("time_"), BookingStates.select_time)
async def select_time(callback: CallbackQuery, state: FSMContext):
    time_str = callback.data.split("_", 1)[1]
    await state.update_data(time=time_str)
    await state.set_state(BookingStates.enter_name)
    await callback.answer()
    await callback.message.edit_text(
        f"تاریخ: <b>{(await state.get_data())['date']}</b>\n"
        f"ساعت: <b>{time_str}</b>\n\n"
        "لطفاً نام کامل خود را وارد کنید:"
    )


@router.message(BookingStates.enter_name)
async def enter_name(message: Message, state: FSMContext):
    name = message.text.strip()
    if len(name) < 2:
        await message.answer("لطفاً یک نام معتبر وارد کنید (حداقل ۲ کاراکتر).")
        return

    await state.update_data(name=name)
    await state.set_state(BookingStates.enter_phone)
    await message.answer(
        "لطفاً شماره تلفن خود را وارد کنید (مثال: ۰۹۱۲۳۴۵۶۷۸۹):"
    )


@router.message(BookingStates.enter_phone)
async def enter_phone(message: Message, state: FSMContext):
    phone = message.text.strip()
    if len(phone) < 7:
        await message.answer("لطفاً شماره تلفن معتبر وارد کنید.")
        return

    await state.update_data(phone=phone)
    await state.set_state(BookingStates.confirm)

    data = await state.get_data()
    summary = (
        "<b>خلاصه نوبت:</b>\n\n"
        f"خدمت: <b>{data['service_title']}</b>\n"
        f"مدت: {data['service_duration']} دقیقه\n"
        f"قیمت: {data['service_price']:,.0f} تومان\n"
        f"تاریخ: <b>{data['date']}</b>\n"
        f"ساعت: <b>{data['time']}</b>\n"
        f"نام: <b>{data['name']}</b>\n"
        f"تلفن: <b>{data['phone']}</b>\n\n"
        "اگر همه اطلاعات درست است، نوبت خود را تأیید کنید:"
    )

    kb = InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(text="تأیید", callback_data="confirm_booking"),
            InlineKeyboardButton(text="لغو", callback_data="cancel_booking"),
        ]
    ])
    await message.answer(summary, reply_markup=kb)


@router.callback_query(F.data == "confirm_booking", BookingStates.confirm)
async def confirm_booking(callback: CallbackQuery, state: FSMContext):
    data = await state.get_data()

    payload = {
        "telegram_id": callback.from_user.id,
        "name": data["name"],
        "phone": data["phone"],
        "service_id": data["service_id"],
        "date": data["date"],
        "time": data["time"],
    }

    result = await create_booking(payload)
    await callback.answer()

    if "error" in result:
        await callback.message.edit_text(f"خطا: {result['error']}\n\nبرای تلاش مجدد از /book استفاده کنید.")
    else:
        await callback.message.edit_text(
            f"درخواست نوبت شما ثبت شد! ✅\n\n"
            f"شناسه نوبت: <b>#{result['id']}</b>\n"
            f"وضعیت: <b>{STATUS_LABELS.get(result['status'], result['status'])}</b>\n\n"
            "بعد از بررسی زمان توسط آرایشگاه، پیام تأیید یا رد برای شما ارسال می‌شود.\n"
            "برای مشاهده نوبت‌های خود از /mybookings استفاده کنید."
        )

    await state.clear()


@router.callback_query(F.data == "cancel_booking")
async def cancel_booking(callback: CallbackQuery, state: FSMContext):
    await state.clear()
    await callback.answer()
    await callback.message.edit_text("نوبت لغو شد. برای شروع نوبت جدید از /book استفاده کنید.")


@router.message(Command("mybookings"))
async def cmd_my_bookings(message: Message, state: FSMContext):
    await state.clear()
    bookings = await get_user_bookings(message.from_user.id)

    if not bookings:
        await message.answer("هنوز نوبتی ندارید. برای ایجاد نوبت از /book استفاده کنید.")
        return

    text = "<b>نوبت‌های شما:</b>\n\n"
    status_icons = {
        "pending": "⏳",
        "confirmed": "✅",
        "rejected": "❌",
        "cancelled": "🚫",
    }

    for b in bookings[:10]:
        icon = status_icons.get(b["status"], "❓")
        label = STATUS_LABELS.get(b["status"], b["status"])
        text += (
            f"{icon} <b>#{b['id']}</b> - {label}\n"
            f"   تاریخ: {b['date']} ساعت {b['time']}\n\n"
        )

    await message.answer(text)


@router.message(Command("cancel"))
async def cmd_cancel(message: Message, state: FSMContext):
    await state.clear()
    await message.answer("عملیات لغو شد. برای شروع نوبت جدید از /book استفاده کنید.")


@router.message()
async def fallback(message: Message, state: FSMContext):
    current_state = await state.get_state()
    if current_state:
        await message.answer("لطفاً مرحله فعلی را دنبال کنید یا برای خروج از /cancel استفاده کنید.")
    else:
        await message.answer(
            "من دستیار رزرو BookEase Barber هستم. برای نوبت جدید از /book و برای مشاهده نوبت‌های موجود از /mybookings استفاده کنید."
        )
