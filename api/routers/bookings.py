from datetime import date as date_type
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, func, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from api.database import get_db
from api.models.user import User
from api.models.service import Service
from api.models.booking import Booking
from api.models.log import Log
from api.schemas.booking import BookingCreate, BookingStatusUpdate, BookingResponse, BookingDetailResponse
from api.dependencies.auth import get_current_admin
from api.services.notification_service import notify_booking_confirmed, notify_booking_rejected

router = APIRouter(prefix="/bookings", tags=["bookings"])


@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
async def create_booking(data: BookingCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.telegram_id == data.telegram_id))
    user = result.scalar_one_or_none()

    if not user:
        user = User(telegram_id=data.telegram_id, name=data.name, phone=data.phone)
        db.add(user)
        await db.flush()
    else:
        user.name = data.name
        user.phone = data.phone

    existing = await db.execute(
        select(Booking).where(
            and_(
                Booking.user_id == user.id,
                Booking.service_id == data.service_id,
                Booking.date == data.date,
                Booking.time == data.time,
                Booking.status == "pending",
            )
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You already have a pending booking for this time slot",
        )

    booking = Booking(
        user_id=user.id,
        service_id=data.service_id,
        date=data.date,
        time=data.time,
        status="pending",
    )
    db.add(booking)
    await db.flush()

    log = Log(
        event_type="booking_created",
        message=f"Booking #{booking.id} created by user {user.telegram_id}",
        extra_data={"booking_id": booking.id, "user_id": user.id, "telegram_id": user.telegram_id},
    )
    db.add(log)

    return BookingResponse.model_validate(booking)


@router.get("", response_model=list[BookingDetailResponse])
async def list_bookings(
    status_filter: str | None = Query(None, alias="status"),
    date_from: date_type | None = Query(None),
    date_to: date_type | None = Query(None),
    service_id: int | None = Query(None),
    search: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_current_admin),
):
    query = (
        select(Booking)
        .options(selectinload(Booking.user), selectinload(Booking.service))
        .order_by(Booking.created_at.desc())
    )

    if status_filter:
        query = query.where(Booking.status == status_filter)
    if date_from:
        query = query.where(Booking.date >= date_from)
    if date_to:
        query = query.where(Booking.date <= date_to)
    if service_id:
        query = query.where(Booking.service_id == service_id)

    result = await db.execute(query)
    bookings = result.scalars().all()

    response = []
    for b in bookings:
        item = BookingDetailResponse(
            id=b.id,
            user_id=b.user_id,
            service_id=b.service_id,
            date=b.date,
            time=b.time,
            status=b.status,
            note=b.note,
            created_at=b.created_at,
            updated_at=b.updated_at,
            user_name=b.user.name if b.user else "",
            user_phone=b.user.phone if b.user else "",
            telegram_id=b.user.telegram_id if b.user else 0,
            service_title=b.service.title if b.service else "",
            service_duration=b.service.duration if b.service else 0,
            service_price=float(b.service.price) if b.service else 0.0,
        )
        if search:
            s = search.lower()
            if s not in item.user_name.lower() and s not in item.user_phone:
                continue
        response.append(item)

    return response


@router.get("/stats")
async def get_stats(
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_current_admin),
):
    total = await db.execute(select(func.count(Booking.id)))
    pending = await db.execute(select(func.count(Booking.id)).where(Booking.status == "pending"))
    confirmed = await db.execute(select(func.count(Booking.id)).where(Booking.status == "confirmed"))
    rejected = await db.execute(select(func.count(Booking.id)).where(Booking.status == "rejected"))

    return {
        "total": total.scalar() or 0,
        "pending": pending.scalar() or 0,
        "confirmed": confirmed.scalar() or 0,
        "rejected": rejected.scalar() or 0,
    }


@router.get("/user/{telegram_id}", response_model=list[BookingResponse])
async def get_user_bookings(telegram_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.telegram_id == telegram_id))
    user = result.scalar_one_or_none()
    if not user:
        return []

    query = (
        select(Booking)
        .options(selectinload(Booking.service))
        .where(Booking.user_id == user.id)
        .order_by(Booking.created_at.desc())
    )
    result = await db.execute(query)
    bookings = result.scalars().all()
    return [BookingResponse.model_validate(b) for b in bookings]


@router.get("/{booking_id}", response_model=BookingDetailResponse)
async def get_booking(
    booking_id: int,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_current_admin),
):
    result = await db.execute(
        select(Booking)
        .options(selectinload(Booking.user), selectinload(Booking.service))
        .where(Booking.id == booking_id)
    )
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

    return BookingDetailResponse(
        id=booking.id,
        user_id=booking.user_id,
        service_id=booking.service_id,
        date=booking.date,
        time=booking.time,
        status=booking.status,
        note=booking.note,
        created_at=booking.created_at,
        updated_at=booking.updated_at,
        user_name=booking.user.name if booking.user else "",
        user_phone=booking.user.phone if booking.user else "",
        telegram_id=booking.user.telegram_id if booking.user else 0,
        service_title=booking.service.title if booking.service else "",
        service_duration=booking.service.duration if booking.service else 0,
        service_price=float(booking.service.price) if booking.service else 0.0,
    )


@router.patch("/{booking_id}/status", response_model=BookingDetailResponse)
async def update_booking_status(
    booking_id: int,
    data: BookingStatusUpdate,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_current_admin),
):
    if data.status not in ("confirmed", "rejected"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Status must be 'confirmed' or 'rejected'")

    result = await db.execute(
        select(Booking)
        .options(selectinload(Booking.user), selectinload(Booking.service))
        .where(Booking.id == booking_id)
    )
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

    booking.status = data.status
    booking.note = data.note

    event_type = f"booking_{data.status}"
    log = Log(
        event_type=event_type,
        message=f"Booking #{booking.id} {data.status} by admin {admin.username}",
        extra_data={"booking_id": booking.id, "admin_id": admin.id, "status": data.status, "note": data.note},
    )
    db.add(log)

    if data.status == "confirmed":
        await notify_booking_confirmed(
            chat_id=booking.user.telegram_id,
            booking_id=booking.id,
            service_title=booking.service.title if booking.service else "",
            date_str=booking.date.isoformat(),
            time_str=booking.time.strftime("%H:%M"),
            note=data.note,
        )
    elif data.status == "rejected":
        await notify_booking_rejected(
            chat_id=booking.user.telegram_id,
            booking_id=booking.id,
            service_title=booking.service.title if booking.service else "",
            date_str=booking.date.isoformat(),
            time_str=booking.time.strftime("%H:%M"),
            note=data.note,
        )

    return BookingDetailResponse(
        id=booking.id,
        user_id=booking.user_id,
        service_id=booking.service_id,
        date=booking.date,
        time=booking.time,
        status=booking.status,
        note=booking.note,
        created_at=booking.created_at,
        updated_at=booking.updated_at,
        user_name=booking.user.name if booking.user else "",
        user_phone=booking.user.phone if booking.user else "",
        telegram_id=booking.user.telegram_id if booking.user else 0,
        service_title=booking.service.title if booking.service else "",
        service_duration=booking.service.duration if booking.service else 0,
        service_price=float(booking.service.price) if booking.service else 0.0,
    )
