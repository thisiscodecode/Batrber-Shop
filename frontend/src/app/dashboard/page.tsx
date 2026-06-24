"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import StatusBadge from "@/components/StatusBadge";

function StatIcon({ type }: { type: string }) {
  const common = "h-6 w-6";
  if (type === "clock") {
    return (
      <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m5-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    );
  }
  if (type === "check") {
    return (
      <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    );
  }
  if (type === "x") {
    return (
      <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    );
  }
  return (
    <svg className={common} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 4v3m8-3v3M5 10h14M6 6h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

export default function DashboardPage() {
  const { getToken } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, rejected: 0 });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      if (!token) return;
      try {
        const [statsData, bookingsData] = await Promise.all([
          api.bookings.stats(token),
          api.bookings.list({ token }),
        ]);
        setStats(statsData);
        setRecentBookings(bookingsData.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getToken]);

  const statCards = [
    { label: "کل نوبت‌ها", value: stats.total, icon: "calendar", helper: "همه درخواست‌های ثبت‌شده" },
    { label: "در انتظار بررسی", value: stats.pending, icon: "clock", helper: "نیازمند پاسخ سریع" },
    { label: "تأیید شده", value: stats.confirmed, icon: "check", helper: "آماده حضور مشتری" },
    { label: "رد شده", value: stats.rejected, icon: "x", helper: "زمان نامناسب یا لغوشده" },
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-5">
          <div className="h-32 rounded-2xl bg-primary-100" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 rounded-2xl bg-primary-100" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <section className="dark-panel mb-6 overflow-hidden rounded-2xl p-6 text-surface-50">
        <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-black text-primary-100">داشبورد مدیریت آرایشگاه</p>
            <h2 className="mt-2 text-xl font-black leading-[1.35]">امروز، هیچ نوبتی نباید بی‌پاسخ بماند.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-surface-100/72">
              درخواست‌های مشتری‌ها را بررسی کنید، نوبت‌های مناسب را تأیید کنید و منوی خدمات آرایشگاه را همیشه به‌روز نگه دارید.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/dashboard/bookings" className="btn-gold rounded-2xl px-6 py-3 text-center text-sm font-black transition-all">
              بررسی نوبت‌ها
            </Link>
            <Link href="/dashboard/services" className="rounded-2xl border border-white/14 bg-white/6 px-6 py-3 text-center text-sm font-bold text-surface-50 transition-all hover:bg-white/10">
              مدیریت خدمات
            </Link>
          </div>
        </div>
      </section>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="luxury-panel card-hover rounded-2xl p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-espresso-900 text-primary-100 shadow-card">
                <StatIcon type={card.icon} />
              </div>
              <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-[10px] font-black text-primary-700">زنده</span>
            </div>
            <h3 className="text-2xl font-black text-espresso-900">{card.value.toLocaleString("fa-IR")}</h3>
            <p className="mt-1 text-sm font-black text-espresso-800">{card.label}</p>
            <p className="mt-0.5 text-xs text-espresso-400">{card.helper}</p>
          </div>
        ))}
      </div>

      <div className="luxury-panel overflow-hidden rounded-2xl">
        <div className="flex flex-col justify-between gap-3 border-b border-primary-200/50 p-5 md:flex-row md:items-center">
          <div>
            <h3 className="text-base font-black text-espresso-900">نوبت‌های اخیر</h3>
            <p className="mt-0.5 text-xs text-espresso-500">آخرین درخواست‌هایی که از ربات رزرو وارد شده‌اند.</p>
          </div>
          <Link href="/dashboard/bookings" className="text-sm font-black text-primary-700 hover:text-primary-800">
            مشاهده همه نوبت‌ها
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-primary-200/50 bg-primary-50/60">
              <tr>
                <th className="px-5 py-3 text-right text-xs font-black text-espresso-500">شناسه</th>
                <th className="px-5 py-3 text-right text-xs font-black text-espresso-500">مشتری</th>
                <th className="px-5 py-3 text-right text-xs font-black text-espresso-500">خدمت</th>
                <th className="px-5 py-3 text-right text-xs font-black text-espresso-500">تاریخ و ساعت</th>
                <th className="px-5 py-3 text-right text-xs font-black text-espresso-500">وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-100">
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-sm text-espresso-400">
                    هنوز نوبتی ثبت نشده است. بعد از اولین رزرو مشتری، اینجا پر می‌شود.
                  </td>
                </tr>
              ) : (
                recentBookings.map((b) => (
                  <tr key={b.id} className="transition-colors hover:bg-primary-50/45">
                    <td className="px-5 py-3 text-sm font-black text-espresso-900">#{b.id}</td>
                    <td className="px-5 py-3 text-sm font-bold text-espresso-700">{b.user_name}</td>
                    <td className="px-5 py-3 text-sm text-espresso-600">{b.service_title}</td>
                    <td className="px-5 py-3 text-sm text-espresso-600">{b.date} {b.time?.substring(0, 5)}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={b.status} />
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
