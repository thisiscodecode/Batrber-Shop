from datetime import date as date_type
from fastapi import APIRouter, Depends, Query
from fastapi.responses import Response

from api.database import get_db
from api.dependencies.auth import get_current_admin
from api.services.export_service import generate_bookings_excel

router = APIRouter(prefix="/export", tags=["export"])


@router.get("/bookings.xlsx")
async def export_bookings(
    date_from: date_type | None = Query(None),
    date_to: date_type | None = Query(None),
    status: str | None = Query(None),
    db=Depends(get_db),
    admin=Depends(get_current_admin),
):
    excel_data = await generate_bookings_excel(db, date_from=date_from, date_to=date_to, status=status)
    return Response(
        content=excel_data,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=bookings_export.xlsx"},
    )
