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

STATUS_ICONS = {
    "pending": "⏳",
    "confirmed": "✅",
    "rejected": "❌",
    "cancelled": "🚫",
}


@router.message(Command("start"))
async def cmd_start(message: Message, state: FSMContext):
    await state.clear()
    text = (
        "✨ <b>BookEase Barber</b> ✨\n"
        "━━━━━━━━━━━━━━━━━━━\n\n"
        "به سامانه رزرو آنلاین آرایشگاه خوش آمدید.\n\n"
        "💈 کوتاهی و فید حرفه‌ای\n"
        "🪒 اصلاح صورت و خط ریش\n"
        "👰 پکیج‌های ویژه داماد\n\n"
        "از منوی زیر یکی را انتخاب کنید:"
    )
    kb = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="💈  رزرو نوبت جدید", callback_data="go_book")],
        [InlineKeyboardButton(text="📋  نوبت‌های من", callback_data="go_mybookings")],
    ])
    await message.answer(text, reply_markup=kb)


@router.callback_query(F.data == "go_book")
async def go_book(callback: CallbackQuery, state: FSMContext):
    await callback.answer()
    services = await get_services()
    if not services:
        await callback.message.edit_text(
            "❌ <b>خدمتی موجود نیست</b>\n\n"
            "در حال حاضر امکان رزرو وجود ندارد.\n"
            "لطفاً بعداً تلاش کنید."
        )
        return

    await state.set_state(BookingStates.select_service)
    await state.update_data(services=services)

    text = (
        "💈 <b>انتخاب خدمت</b>\n"
        "━━━━━━━━━━━━━━━━━━━\n\n"
        "لطفاً یکی از خدمات زیر را انتخاب کنید:"
    )
    keyboard_rows = []
    for svc in services:
        price_fmt = f"{svc['price']:,.0f}"
        keyboard_rows.append([
            InlineKeyboardButton(
                text=f"✨ {svc['title']}",
                callback_data=f"svc_{svc['id']}",
            )
        ])
        keyboard_rows.append([
            InlineKeyboardButton(
                text=f"    💰 {price_fmt} تومان  ·  ⏱ {svc['duration']} دقیقه",
                callback_data=f"svc_{svc['id']}",
            )
        ])

    kb = InlineKeyboardMarkup(inline_keyboard=keyboard_rows)
    await callback.message.edit_text(text, reply_markup=kb)


@router.callback_query(F.data == "go_mybookings")
async def go_my_bookings(callback: CallbackQuery, state: FSMContext):
    await state.clear()
    await callback.answer()
    bookings = await get_user_bookings(callback.from_user.id)

    if not bookings:
        kb = InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="💈  رزرو نوبت جدید", callback_data="go_book")],
        ])
        await callback.message.edit_text(
            "📋 <b>نوبت‌های شما</b>\n"
            "━━━━━━━━━━━━━━━━━━━\n\n"
            "شما هنوز نوبتی ثبت نکرده‌اید.\n\n"
            "برای رزرو اولین نوبت خود، دکمه زیر را بزنید:",
            reply_markup=kb,
        )
        return

    text = (
        "📋 <b>نوبت‌های شما</b>\n"
        "━━━━━━━━━━━━━━━━━━━\n\n"
    )
    for b in bookings[:10]:
        icon = STATUS_ICONS.get(b["status"], "❓")
        label = STATUS_LABELS.get(b["status"], b["status"])
        text += (
            f"{icon} <b>نوبت #{b['id']}</b> — {label}\n"
            f"    📅 {b['date']}  ·  🕐 {b['time']}\n\n"
        )

    kb = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="💈  رزرو نوبت جدید", callback_data="go_book")],
    ])
    await callback.message.edit_text(text, reply_markup=kb)


@router.message(Command("book"))
async def cmd_book(message: Message, state: FSMContext):
    services = await get_services()
    if not services:
        kb = InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="📋  نوبت‌های من", callback_data="go_mybookings")],
        ])
        await message.answer(
            "❌ <b>خدمتی موجود نیست</b>\n\n"
            "در حال حاضر امکان رزرو وجود ندارد.\n"
            "لطفاً بعداً تلاش کنید.",
            reply_markup=kb,
        )
        return

    await state.set_state(BookingStates.select_service)
    await state.update_data(services=services)

    text = (
        "💈 <b>انتخاب خدمت</b>\n"
        "━━━━━━━━━━━━━━━━━━━\n\n"
        "لطفاً یکی از خدمات زیر را انتخاب کنید:"
    )
    keyboard_rows = []
    for svc in services:
        price_fmt = f"{svc['price']:,.0f}"
        keyboard_rows.append([
            InlineKeyboardButton(
                text=f"✨ {svc['title']}",
                callback_data=f"svc_{svc['id']}",
            )
        ])
        keyboard_rows.append([
            InlineKeyboardButton(
                text=f"    💰 {price_fmt} تومان  ·  ⏱ {svc['duration']} دقیقه",
                callback_data=f"svc_{svc['id']}",
            )
        ])

    kb = InlineKeyboardMarkup(inline_keyboard=keyboard_rows)
    await message.answer(text, reply_markup=kb)


@router.callback_query(F.data.startswith("svc_"), BookingStates.select_service)
async def select_service(callback: CallbackQuery, state: FSMContext):
    service_id = int(callback.data.split("_")[1])
    data = await state.get_data()
    services = data.get("services", [])
    selected = next((s for s in services if s["id"] == service_id), None)

    if not selected:
        await callback.answer("❌ خدمت نامعتبر است", show_alert=True)
        return

    await state.update_data(service_id=service_id, service_title=selected["title"], service_duration=selected["duration"], service_price=selected["price"])
    await state.set_state(BookingStates.select_date)
    await callback.answer()

    today = datetime.now().date()
    text = (
        f"✨ <b>{selected['title']}</b>\n"
        f"    💰 {selected['price']:,.0f} تومان  ·  ⏱ {selected['duration']} دقیقه\n\n"
        "━━━━━━━━━━━━━━━━━━━\n\n"
        "📅 <b>انتخاب تاریخ</b>\n"
        "لطفاً یکی از روزهای زیر را انتخاب کنید:"
    )

    keyboard_rows = []
    for i in range(1, 8):
        d = today + timedelta(days=i)
        label = f"{WEEKDAY_MAP[d.weekday()]} {d.day} {MONTH_MAP[d.month]}"
        keyboard_rows.append([
            InlineKeyboardButton(text=label, callback_data=f"date_{d.isoformat()}"),
        ])

    kb = InlineKeyboardMarkup(inline_keyboard=keyboard_rows)
    await callback.message.edit_text(text, reply_markup=kb)


@router.callback_query(F.data.startswith("date_"), BookingStates.select_date)
async def select_date(callback: CallbackQuery, state: FSMContext):
    date_str = callback.data.split("_", 1)[1]
    await state.update_data(date=date_str)
    await state.set_state(BookingStates.select_time)
    await callback.answer()

    data = await state.get_data()
    text = (
        f"✨ <b>{data['service_title']}</b>\n"
        f"    💰 {data['service_price']:,.0f} تومان  ·  ⏱ {data['service_duration']} دقیقه\n\n"
        f"📅 <b>{date_str}</b>\n\n"
        "━━━━━━━━━━━━━━━━━━━\n\n"
        "🕐 <b>انتخاب ساعت</b>\n"
        "ساعت مورد نظر خود را انتخاب کنید:"
    )

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
    await callback.message.edit_text(text, reply_markup=kb)


@router.callback_query(F.data.startswith("time_"), BookingStates.select_time)
async def select_time(callback: CallbackQuery, state: FSMContext):
    time_str = callback.data.split("_", 1)[1]
    await state.update_data(time=time_str)
    await state.set_state(BookingStates.enter_name)
    await callback.answer()

    data = await state.get_data()
    text = (
        f"✨ <b>{data['service_title']}</b>\n"
        f"    💰 {data['service_price']:,.0f} تومان  ·  ⏱ {data['service_duration']} دقیقه\n"
        f"📅 {data['date']}  ·  🕐 {time_str}\n\n"
        "━━━━━━━━━━━━━━━━━━━\n\n"
        "👤 <b>نام و نام خانوادگی</b>\n"
        "نام کامل خود را تایپ کنید:"
    )
    await callback.message.edit_text(text)


@router.message(BookingStates.enter_name)
async def enter_name(message: Message, state: FSMContext):
    name = message.text.strip()
    if len(name) < 2:
        await message.answer("❌ لطفاً یک نام معتبر وارد کنید (حداقل ۲ کاراکتر).")
        return

    await state.update_data(name=name)
    await state.set_state(BookingStates.enter_phone)

    data = await state.get_data()
    text = (
        f"✨ <b>{data['service_title']}</b>\n"
        f"    💰 {data['service_price']:,.0f} تومان  ·  ⏱ {data['service_duration']} دقیقه\n"
        f"📅 {data['date']}  ·  🕐 {data['time']}\n"
        f"👤 {name}\n\n"
        "━━━━━━━━━━━━━━━━━━━\n\n"
        "📱 <b>شماره تلفن</b>\n"
        "شماره تلفن خود را وارد کنید:\n"
        "<i>مثال: ۰۹۱۲۳۴۵۶۷۸۹</i>"
    )
    await message.answer(text)


@router.message(BookingStates.enter_phone)
async def enter_phone(message: Message, state: FSMContext):
    phone = message.text.strip()
    if len(phone) < 7:
        await message.answer("❌ لطفاً شماره تلفن معتبر وارد کنید.")
        return

    await state.update_data(phone=phone)
    await state.set_state(BookingStates.confirm)

    data = await state.get_data()
    summary = (
        "📋 <b>تأیید نوبت</b>\n"
        "━━━━━━━━━━━━━━━━━━━\n\n"
        f"✨ <b>{data['service_title']}</b>\n"
        f"    💰 {data['service_price']:,.0f} تومان  ·  ⏱ {data['service_duration']} دقیقه\n\n"
        f"📅 تاریخ: <b>{data['date']}</b>\n"
        f"🕐 ساعت: <b>{data['time']}</b>\n"
        f"👤 نام: <b>{data['name']}</b>\n"
        f"📱 تلفن: <b>{data['phone']}</b>\n\n"
        "━━━━━━━━━━━━━━━━━━━\n\n"
        "⚠️ اطلاعات بالا را بررسی کنید.\n"
        "اگر همه چیز درست است، نوبت خود را ثبت کنید:"
    )

    kb = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="✅  ثبت نوبت", callback_data="confirm_booking")],
        [InlineKeyboardButton(text="❌  انصراف", callback_data="cancel_booking")],
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
        kb = InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="💈  تلاش مجدد", callback_data="go_book")],
            [InlineKeyboardButton(text="🏠  بازگشت", callback_data="go_start")],
        ])
        await callback.message.edit_text(
            "❌ <b>خطا در ثبت نوبت</b>\n"
            "━━━━━━━━━━━━━━━━━━━\n\n"
            f"{result['error']}\n\n"
            "لطفاً دوباره تلاش کنید:",
            reply_markup=kb,
        )
    else:
        kb = InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="📋  نوبت‌های من", callback_data="go_mybookings")],
            [InlineKeyboardButton(text="💈  رزرو مجدد", callback_data="go_book")],
        ])
        await callback.message.edit_text(
            "✅ <b>نوبت شما ثبت شد!</b>\n"
            "━━━━━━━━━━━━━━━━━━━\n\n"
            f"🔖 شناسه نوبت: <b>#{result['id']}</b>\n"
            f"📊 وضعیت: <b>{STATUS_LABELS.get(result['status'], result['status'])}</b>\n\n"
            "آرایشگاه پس از بررسی زمان، نتیجه را اطلاع می‌دهد.\n\n"
            "از منوی زیر یکی را انتخاب کنید:",
            reply_markup=kb,
        )

    await state.clear()


@router.callback_query(F.data == "go_start")
async def go_start(callback: CallbackQuery, state: FSMContext):
    await state.clear()
    await callback.answer()
    text = (
        "✨ <b>BookEase Barber</b> ✨\n"
        "━━━━━━━━━━━━━━━━━━━\n\n"
        "به سامانه رزرو آنلاین آرایشگاه خوش آمدید.\n\n"
        "💈 کوتاهی و فید حرفه‌ای\n"
        "🪒 اصلاح صورت و خط ریش\n"
        "👰 پکیج‌های ویژه داماد\n\n"
        "از منوی زیر یکی را انتخاب کنید:"
    )
    kb = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="💈  رزرو نوبت جدید", callback_data="go_book")],
        [InlineKeyboardButton(text="📋  نوبت‌های من", callback_data="go_mybookings")],
    ])
    await callback.message.edit_text(text, reply_markup=kb)


@router.callback_query(F.data == "cancel_booking")
async def cancel_booking(callback: CallbackQuery, state: FSMContext):
    await state.clear()
    await callback.answer()
    kb = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="💈  رزرو نوبت جدید", callback_data="go_book")],
    ])
    await callback.message.edit_text(
        "🚫 <b>نوبت لغو شد</b>\n"
        "━━━━━━━━━━━━━━━━━━━\n\n"
        "عملیات رزرو لغو شد.\n"
        "برای شروع مجدد روی دکمه زیر کلیک کنید:",
        reply_markup=kb,
    )


@router.message(Command("mybookings"))
async def cmd_my_bookings(message: Message, state: FSMContext):
    await state.clear()
    bookings = await get_user_bookings(message.from_user.id)

    if not bookings:
        kb = InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="💈  رزرو نوبت جدید", callback_data="go_book")],
        ])
        await message.answer(
            "📋 <b>نوبت‌های شما</b>\n"
            "━━━━━━━━━━━━━━━━━━━\n\n"
            "شما هنوز نوبتی ثبت نکرده‌اید.",
            reply_markup=kb,
        )
        return

    text = (
        "📋 <b>نوبت‌های شما</b>\n"
        "━━━━━━━━━━━━━━━━━━━\n\n"
    )
    for b in bookings[:10]:
        icon = STATUS_ICONS.get(b["status"], "❓")
        label = STATUS_LABELS.get(b["status"], b["status"])
        text += (
            f"{icon} <b>نوبت #{b['id']}</b> — {label}\n"
            f"    📅 {b['date']}  ·  🕐 {b['time']}\n\n"
        )

    kb = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="💈  رزرو نوبت جدید", callback_data="go_book")],
    ])
    await message.answer(text, reply_markup=kb)


@router.message(Command("cancel"))
async def cmd_cancel(message: Message, state: FSMContext):
    await state.clear()
    kb = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="💈  رزرو نوبت جدید", callback_data="go_book")],
    ])
    await message.answer(
        "🚫 <b>عملیات لغو شد</b>\n\n"
        "برای شروع رزرو جدید:",
        reply_markup=kb,
    )


@router.message()
async def fallback(message: Message, state: FSMContext):
    current_state = await state.get_state()
    if current_state:
        kb = InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="❌  لغو عملیات", callback_data="cancel_booking")],
        ])
        await message.answer(
            "⚠️ <b>لطفاً مرحله فعلی را تکمیل کنید</b>\n"
            "یا برای خروج روی دکمه زیر کلیک کنید:",
            reply_markup=kb,
        )
    else:
        kb = InlineKeyboardMarkup(inline_keyboard=[
            [InlineKeyboardButton(text="💈  رزرو نوبت جدید", callback_data="go_book")],
            [InlineKeyboardButton(text="📋  نوبت‌های من", callback_data="go_mybookings")],
        ])
        await message.answer(
            "✨ <b>BookEase Barber</b> ✨\n"
            "━━━━━━━━━━━━━━━━━━━\n\n"
            "من دستیار رزرو آرایشگاه هستم.\n"
            "از منوی زیر یکی را انتخاب کنید:",
            reply_markup=kb,
        )
