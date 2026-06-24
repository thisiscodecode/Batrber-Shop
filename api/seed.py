import asyncio
import os
import sys
from datetime import date, time, timedelta

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from api.config import settings
from api.database import engine, Base, async_session
from api.models import Admin, Service, User, Booking
from api.dependencies.auth import hash_password
from sqlalchemy import select, delete


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as db:
        result = await db.execute(select(Admin).where(Admin.username == settings.ADMIN_USERNAME))
        if not result.scalar_one_or_none():
            admin = Admin(
                username=settings.ADMIN_USERNAME,
                password_hash=hash_password(settings.ADMIN_PASSWORD),
            )
            db.add(admin)
            print(f"Created admin user: {settings.ADMIN_USERNAME}")

        result = await db.execute(select(Service))
        existing_services = result.scalars().all()

        needs_reseed = False
        if not existing_services:
            needs_reseed = True
        elif any(s.title in ("General Consultation", "Follow-up Session", "Full Checkup", "Workshop", "مشاوره عمومی", "ویزیت تخصصی", "چکاپ کامل") for s in existing_services):
            print("Detected old English seed data, replacing with Persian data")
            needs_reseed = True

        if needs_reseed:
            await db.execute(delete(Booking))
            await db.execute(delete(User))
            await db.execute(delete(Service))
            await db.flush()

            services = [
                Service(title="فید کلاسیک و فرم‌دهی مو", duration=40, price=240000.0, active=True),
                Service(title="اسکین‌فید حرفه‌ای", duration=50, price=320000.0, active=True),
                Service(title="اصلاح صورت با حوله گرم", duration=30, price=180000.0, active=True),
                Service(title="کوتاهی مو + اصلاح صورت", duration=60, price=390000.0, active=True),
                Service(title="پاکسازی صورت و ماسک بعد اصلاح", duration=35, price=260000.0, active=True),
                Service(title="پکیج داماد", duration=90, price=750000.0, active=True),
            ]
            db.add_all(services)
            await db.flush()
            print("Created Persian services")

            users = [
                User(telegram_id=100001, name="آرمان رضایی", phone="+989121234567"),
                User(telegram_id=100002, name="سامان کریمی", phone="+989122345678"),
                User(telegram_id=100003, name="نیما شریفی", phone="+989123456789"),
                User(telegram_id=100004, name="امیرحسین محمدی", phone="+989124567890"),
                User(telegram_id=100005, name="عرفان احمدی", phone="+989125678901"),
                User(telegram_id=100006, name="پارسا نادری", phone="+989126789012"),
                User(telegram_id=100007, name="حامد قاسمی", phone="+989127890123"),
                User(telegram_id=100008, name="پویا عباسی", phone="+989128901234"),
                User(telegram_id=100009, name="کیان رستمی", phone="+989129012345"),
                User(telegram_id=100010, name="رضا مرادی", phone="+989120123456"),
            ]
            db.add_all(users)
            await db.flush()
            print("Created barber sample customers")

            today = date.today()
            bookings = [
                Booking(user_id=users[0].id, service_id=services[0].id, date=today + timedelta(days=1), time=time(9, 0), status="confirmed"),
                Booking(user_id=users[1].id, service_id=services[2].id, date=today + timedelta(days=1), time=time(10, 30), status="pending"),
                Booking(user_id=users[2].id, service_id=services[5].id, date=today + timedelta(days=1), time=time(12, 0), status="confirmed"),
                Booking(user_id=users[3].id, service_id=services[1].id, date=today + timedelta(days=2), time=time(9, 30), status="pending"),
                Booking(user_id=users[4].id, service_id=services[3].id, date=today + timedelta(days=2), time=time(14, 0), status="confirmed"),
                Booking(user_id=users[5].id, service_id=services[4].id, date=today + timedelta(days=2), time=time(16, 0), status="rejected", note="زمان انتخابی با برنامه استادکار تداخل دارد"),
                Booking(user_id=users[6].id, service_id=services[0].id, date=today + timedelta(days=3), time=time(9, 0), status="pending"),
                Booking(user_id=users[7].id, service_id=services[2].id, date=today + timedelta(days=3), time=time(10, 30), status="confirmed"),
                Booking(user_id=users[8].id, service_id=services[3].id, date=today + timedelta(days=3), time=time(13, 0), status="pending"),
                Booking(user_id=users[9].id, service_id=services[1].id, date=today + timedelta(days=4), time=time(11, 0), status="pending"),
                Booking(user_id=users[0].id, service_id=services[3].id, date=today - timedelta(days=1), time=time(10, 0), status="confirmed"),
                Booking(user_id=users[1].id, service_id=services[0].id, date=today - timedelta(days=2), time=time(14, 0), status="confirmed"),
                Booking(user_id=users[3].id, service_id=services[5].id, date=today - timedelta(days=3), time=time(11, 0), status="rejected", note="مشتری درخواست تغییر روز داشت"),
                Booking(user_id=users[5].id, service_id=services[2].id, date=today - timedelta(days=4), time=time(9, 30), status="confirmed"),
                Booking(user_id=users[7].id, service_id=services[1].id, date=today - timedelta(days=5), time=time(16, 0), status="confirmed"),
            ]
            db.add_all(bookings)
            print("Created barber sample bookings")

        await db.commit()
    print("Seed completed!")
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed())
