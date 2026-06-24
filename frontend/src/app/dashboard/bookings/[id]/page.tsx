"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import StatusBadge from "@/components/StatusBadge";

export default function BookingDetailPage() {
  const { getToken } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<"confirmed" | "rejected">("confirmed");
  const [note, setNote] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      const token = getToken();
      if (!token) return;
      try {
        const data = await api.bookings.get(Number(params.id), token);
        setBooking(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [params.id, getToken]);

  const handleAction = async () => {
    const token = getToken();
    if (!token || !booking) return;
    setActionLoading(true);
    try {
      await api.bookings.updateStatus(booking.id, modalAction, note || null, token);
      setBooking({ ...booking, status: modalAction, note: note || booking.note });
      setShowModal(false);
      setNote("");
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-shell">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-primary-100 rounded w-36" />
          <div className="h-48 bg-primary-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="page-shell">
        <p className="text-sm text-espresso-400">نوبت یافت نشد.</p>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <button onClick={() => router.back()} className="text-primary-700 hover:text-primary-800 text-xs font-black mb-4 flex items-center gap-1">
        <svg className="w-3.5 h-3.5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        بازگشت
      </button>

      <div className="mb-6">
        <h2 className="text-xl font-black text-espresso-900">نوبت #{booking.id}</h2>
        <p className="mt-1 text-sm text-espresso-500">جزئیات و مدیریت نوبت</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 luxury-panel rounded-2xl p-5">
          <h3 className="text-sm font-black text-espresso-800 mb-3">اطلاعات نوبت</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-espresso-400 mb-0.5">نام مشتری</p>
              <p className="text-sm font-bold text-espresso-800">{booking.user_name}</p>
            </div>
            <div>
              <p className="text-xs text-espresso-400 mb-0.5">تلفن</p>
              <p className="text-sm font-bold text-espresso-800" dir="ltr">{booking.user_phone}</p>
            </div>
            <div>
              <p className="text-xs text-espresso-400 mb-0.5">Telegram ID</p>
              <p className="text-sm font-bold text-espresso-800">{booking.telegram_id}</p>
            </div>
            <div>
              <p className="text-xs text-espresso-400 mb-0.5">خدمت</p>
              <p className="text-sm font-bold text-espresso-800">{booking.service_title}</p>
            </div>
            <div>
              <p className="text-xs text-espresso-400 mb-0.5">تاریخ</p>
              <p className="text-sm font-bold text-espresso-800">{booking.date}</p>
            </div>
            <div>
              <p className="text-xs text-espresso-400 mb-0.5">ساعت</p>
              <p className="text-sm font-bold text-espresso-800">{booking.time?.substring(0, 5)}</p>
            </div>
            <div>
              <p className="text-xs text-espresso-400 mb-0.5">مدت</p>
              <p className="text-sm font-bold text-espresso-800">{booking.service_duration} دقیقه</p>
            </div>
            <div>
              <p className="text-xs text-espresso-400 mb-0.5">قیمت</p>
              <p className="text-sm font-bold text-espresso-800">{booking.service_price?.toLocaleString("fa-IR")} تومان</p>
            </div>
            {booking.note && (
              <div className="col-span-2">
                <p className="text-xs text-espresso-400 mb-0.5">یادداشت</p>
                <p className="text-sm font-bold text-espresso-800">{booking.note}</p>
              </div>
            )}
          </div>
        </div>

        <div className="luxury-panel rounded-2xl p-5">
          <h3 className="text-sm font-black text-espresso-800 mb-3">وضعیت و اقدامات</h3>
          <div className="mb-4">
            <p className="text-xs text-espresso-400 mb-1">وضعیت فعلی</p>
            <StatusBadge status={booking.status} />
          </div>

          <div className="mb-3">
            <p className="text-xs text-espresso-400 mb-0.5">ایجاد شده</p>
            <p className="text-xs font-bold text-espresso-700">{new Date(booking.created_at).toLocaleString("fa-IR")}</p>
          </div>

          <div className="mb-5">
            <p className="text-xs text-espresso-400 mb-0.5">آخرین به‌روزرسانی</p>
            <p className="text-xs font-bold text-espresso-700">{new Date(booking.updated_at).toLocaleString("fa-IR")}</p>
          </div>

          {booking.status === "pending" && (
            <div className="space-y-2">
              <button
                onClick={() => { setModalAction("confirmed"); setShowModal(true); }}
                className="w-full py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-black hover:bg-emerald-600 transition-all"
              >
                تأیید نوبت
              </button>
              <button
                onClick={() => { setModalAction("rejected"); setShowModal(true); }}
                className="w-full py-2.5 bg-red-500 text-white rounded-xl text-sm font-black hover:bg-red-600 transition-all"
              >
                رد نوبت
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-espresso-900/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="luxury-panel rounded-2xl shadow-xl w-full max-w-md p-5">
            <h3 className="text-base font-black text-espresso-900 mb-3">
              {modalAction === "confirmed" ? "تأیید نوبت" : "رد نوبت"}
            </h3>
            <p className="text-xs text-espresso-500 mb-3">
              {modalAction === "confirmed"
                ? "مشتری اعلان تأیید دریافت خواهد کرد."
                : "مشتری اعلان رد دریافت خواهد کرد."}
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="یادداشت اختیاری برای مشتری..."
              className="w-full px-3 py-2.5 bg-white border border-primary-200/60 rounded-xl text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary-400 mb-3"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowModal(false); setNote(""); }}
                className="flex-1 py-2.5 bg-primary-50 text-espresso-700 rounded-xl text-sm font-black hover:bg-primary-100 transition-all"
              >
                لغو
              </button>
              <button
                onClick={handleAction}
                disabled={actionLoading}
                className={`flex-1 py-2.5 text-white rounded-xl text-sm font-black transition-all disabled:opacity-50 ${
                  modalAction === "confirmed"
                    ? "bg-emerald-500 hover:bg-emerald-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {actionLoading ? "در حال پردازش..." : modalAction === "confirmed" ? "تأیید" : "رد"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
