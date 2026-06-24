"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";

export default function ExportPage() {
  const { getToken } = useAuth();
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [status, setStatus] = useState("");
  const [downloading, setDownloading] = useState(false);

  const handleExport = async () => {
    const token = getToken();
    if (!token) return;
    setDownloading(true);

    try {
      const url = api.export.bookingsUrl(
        dateFrom || undefined,
        dateTo || undefined,
        status || undefined,
        token
      );

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "bookings_export.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-black text-espresso-900">خروجی اطلاعات</h2>
        <p className="mt-1 text-sm text-espresso-500">دانلود اطلاعات نوبت‌ها به صورت فایل Excel</p>
      </div>

      <div className="luxury-panel rounded-2xl p-6 max-w-xl">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-espresso-700 mb-1">از تاریخ</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-primary-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-espresso-700 mb-1">تا تاریخ</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-primary-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-espresso-700 mb-1">فیلتر وضعیت</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-primary-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            >
              <option value="">همه وضعیت‌ها</option>
              <option value="pending">در انتظار</option>
              <option value="confirmed">تأیید شده</option>
              <option value="rejected">رد شده</option>
            </select>
          </div>

          <button
            onClick={handleExport}
            disabled={downloading}
            className="btn-gold w-full py-2.5 text-sm font-black rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {downloading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                در حال ایجاد...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                دانلود Excel
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
