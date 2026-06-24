from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from api.database import get_db
from api.models.service import Service
from api.schemas.service import ServiceCreate, ServiceUpdate, ServiceResponse
from api.dependencies.auth import get_current_admin

router = APIRouter(prefix="/services", tags=["services"])


@router.get("", response_model=list[ServiceResponse])
async def list_services(
    include_inactive: bool = False,
    db: AsyncSession = Depends(get_db),
):
    query = select(Service).order_by(Service.id)
    if not include_inactive:
        query = query.where(Service.active == True)
    result = await db.execute(query)
    services = result.scalars().all()
    return [ServiceResponse.model_validate(s) for s in services]


@router.post("", response_model=ServiceResponse, status_code=status.HTTP_201_CREATED)
async def create_service(
    data: ServiceCreate,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_current_admin),
):
    service = Service(
        title=data.title,
        duration=data.duration,
        price=data.price,
        active=data.active,
    )
    db.add(service)
    await db.flush()
    return ServiceResponse.model_validate(service)


@router.patch("/{service_id}", response_model=ServiceResponse)
async def update_service(
    service_id: int,
    data: ServiceUpdate,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_current_admin),
):
    result = await db.execute(select(Service).where(Service.id == service_id))
    service = result.scalar_one_or_none()
    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found")

    if data.title is not None:
        service.title = data.title
    if data.duration is not None:
        service.duration = data.duration
    if data.price is not None:
        service.price = data.price
    if data.active is not None:
        service.active = data.active

    await db.flush()
    return ServiceResponse.model_validate(service)


@router.delete("/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
async def deactivate_service(
    service_id: int,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_current_admin),
):
    result = await db.execute(select(Service).where(Service.id == service_id))
    service = result.scalar_one_or_none()
    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found")

    service.active = False
    await db.flush()
