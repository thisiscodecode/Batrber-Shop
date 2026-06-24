"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import StatusBadge from "@/components/StatusBadge";

export default function BookingsPage() {
  const { getToken } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchBookings = async () => {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    try {
      const data = await api.bookings.list({
        status: statusFilter || undefined,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
        search: searchQuery || undefined,
        token,
      });
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, dateFrom, dateTo]);

  const handleSearch = () => fetchBookings();

  return (
    <div className="page-shell">
      <div className="mb-8">
        <h2 className="page-title">همه نوبت‌ها</h2>
        <p className="page-subtitle">مدیریت و بررسی تمام درخواست‌های نوبت</p>
      </div>

      {/* Filters */}
      <div className="luxury-panel rounded-2xl p-5 mb-5">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-black text-espresso-700 mb-1">جستجو</label>
            <div className="relative">
              <svg className="w-4 h-4 text-espresso-300 absolute right-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="جستجو بر اساس نام یا تلفن..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-4 pr-10 py-2 bg-white border border-primary-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-espresso-700 mb-1">وضعیت</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-primary-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            >
              <option value="">همه</option>
              <option value="pending">در انتظار</option>
              <option value="confirmed">تأیید شده</option>
              <option value="rejected">رد شده</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-espresso-700 mb-1">از تاریخ</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 bg-white border border-primary-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-espresso-700 mb-1">تا تاریخ</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 bg-white border border-primary-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>

          <button
            onClick={handleSearch}
            className="btn-gold px-4 py-2 rounded-xl text-sm font-black transition-all"
          >
            جستجو
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="luxury-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary-50/60 border-b border-primary-200/50">
              <tr>
                <th className="text-right px-5 py-3 text-xs font-black text-espresso-500">شناسه</th>
                <th className="text-right px-5 py-3 text-xs font-black text-espresso-500">مشتری</th>
                <th className="text-right px-5 py-3 text-xs font-black text-espresso-500">تلفن</th>
                <th className="text-right px-5 py-3 text-xs font-black text-espresso-500">خدمت</th>
                <th className="text-right px-5 py-3 text-xs font-black text-espresso-500">تاریخ و ساعت</th>
                <th className="text-right px-5 py-3 text-xs font-black text-espresso-500">وضعیت</th>
                <th className="text-right px-5 py-3 text-xs font-black text-espresso-500">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={7} className="px-5 py-3">
                      <div className="h-3 bg-primary-100 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-sm text-espresso-400">
                    نوبتی یافت نشد
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-primary-50/45 transition-colors">
                    <td className="px-5 py-3 text-sm font-black text-espresso-900">#{b.id}</td>
                    <td className="px-5 py-3 text-sm text-espresso-700">{b.user_name}</td>
                    <td className="px-5 py-3 text-sm text-espresso-500" dir="ltr">{b.user_phone}</td>
                    <td className="px-5 py-3 text-sm text-espresso-600">{b.service_title}</td>
                    <td className="px-5 py-3 text-sm text-espresso-600">{b.date} {b.time?.substring(0, 5)}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="px-5 py-3">
                      <Link
                        href={`/dashboard/bookings/${b.id}`}
                        className="text-primary-700 hover:text-primary-800 text-xs font-black"
                      >
                        مشاهده
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
