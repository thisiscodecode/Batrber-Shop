"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function ServicesPage() {
  const { getToken } = useAuth();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newService, setNewService] = useState({ title: "", duration: 30, price: 0 });
  const [saving, setSaving] = useState(false);

  const fetchServices = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const data = await api.services.list(true, token);
      setServices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleCreate = async () => {
    const token = getToken();
    if (!token || !newService.title.trim()) return;
    setSaving(true);
    try {
      await api.services.create({ ...newService, title: newService.title.trim() }, token);
      setShowAddModal(false);
      setNewService({ title: "", duration: 30, price: 0 });
      await fetchServices();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id: number, currentActive: boolean) => {
    const token = getToken();
    if (!token) return;
    try {
      await api.services.update(id, { active: !currentActive }, token);
      await fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <div className="dark-panel mb-6 flex flex-col justify-between gap-4 rounded-2xl p-6 text-surface-50 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-black text-primary-100">منوی خدمات آرایشگاه</p>
          <h2 className="mt-2 text-xl font-black">خدماتی که مشتری واقعاً می‌فهمد و رزرو می‌کند</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-surface-100/72">
            عنوان، زمان و قیمت هر خدمت را واضح نگه دارید تا مشتری قبل از رزرو بداند چه تجربه‌ای دریافت می‌کند.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-gold inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-black transition-all"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          افزودن خدمت جدید
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-2xl bg-primary-100" />
          ))
        ) : services.length === 0 ? (
          <div className="luxury-panel col-span-full rounded-2xl py-12 text-center text-sm text-espresso-500">
            هنوز خدمتی اضافه نشده است. اولین خدمت واقعی آرایشگاه را ثبت کنید.
          </div>
        ) : (
          services.map((svc) => (
            <article key={svc.id} className="luxury-panel card-hover rounded-2xl p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-espresso-900 text-primary-100 shadow-card">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.1 6.7-8.7 8.7a3 3 0 1 0 2.1 2.1l8.7-8.7" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.9 6.7 8.7 8.7a3 3 0 1 1-2.1 2.1L7.8 8.8" />
                  </svg>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${
                  svc.active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                }`}>
                  {svc.active ? "قابل رزرو" : "موقتاً غیرفعال"}
                </span>
              </div>

              <h3 className="text-base font-black text-espresso-900">{svc.title}</h3>
              <p className="mt-2 text-sm leading-7 text-espresso-500">
                این خدمت در ربات رزرو نمایش داده می‌شود و مشتری قبل از ثبت نوبت، مدت و قیمت آن را می‌بیند.
              </p>

              <div className="my-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white p-3 shadow-sm">
                  <p className="text-xs font-bold text-espresso-400">مدت خدمت</p>
                  <p className="mt-1 text-sm font-black text-espresso-900">{svc.duration} دقیقه</p>
                </div>
                <div className="rounded-xl bg-white p-3 shadow-sm">
                  <p className="text-xs font-bold text-espresso-400">قیمت</p>
                  <p className="mt-1 text-sm font-black text-primary-700">{Number(svc.price).toLocaleString("fa-IR")} تومان</p>
                </div>
              </div>

              <button
                onClick={() => handleToggle(svc.id, svc.active)}
                className={`w-full rounded-2xl py-3 text-sm font-black transition-all ${
                  svc.active
                    ? "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                    : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                }`}
              >
                {svc.active ? "غیرفعال کردن رزرو این خدمت" : "فعال کردن برای رزرو"}
              </button>
            </article>
          ))
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-espresso-900/60 p-4 backdrop-blur-sm">
          <div className="luxury-panel w-full max-w-md rounded-2xl p-5">
            <h3 className="text-base font-black text-espresso-900">افزودن خدمت جدید</h3>
            <p className="mt-1 text-xs leading-7 text-espresso-500">نام، مدت و قیمت را مثل منوی واقعی آرایشگاه وارد کنید.</p>
            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-black text-espresso-800">عنوان خدمت</label>
                <input
                  type="text"
                  value={newService.title}
                  onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                  className="w-full rounded-xl border border-primary-200/60 bg-white px-3 py-2.5 text-sm outline-none transition-all focus:border-primary-400 focus:ring-2 focus:ring-primary-400"
                  placeholder="مثلاً فید کلاسیک و فرم‌دهی مو"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-black text-espresso-800">مدت (دقیقه)</label>
                  <input
                    type="number"
                    min="5"
                    value={newService.duration}
                    onChange={(e) => setNewService({ ...newService, duration: parseInt(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-primary-200/60 bg-white px-3 py-2.5 text-sm outline-none transition-all focus:border-primary-400 focus:ring-2 focus:ring-primary-400"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-black text-espresso-800">قیمت (تومان)</label>
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    value={newService.price}
                    onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-xl border border-primary-200/60 bg-white px-3 py-2.5 text-sm outline-none transition-all focus:border-primary-400 focus:ring-2 focus:ring-primary-400"
                  />
                </div>
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => { setShowAddModal(false); setNewService({ title: "", duration: 30, price: 0 }); }}
                className="flex-1 rounded-xl bg-primary-50 py-2.5 text-sm font-black text-espresso-700 transition-all hover:bg-primary-100"
              >
                لغو
              </button>
              <button
                onClick={handleCreate}
                disabled={saving || !newService.title.trim()}
                className="btn-gold flex-1 rounded-xl py-2.5 text-sm font-black transition-all disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "در حال ایجاد..." : "ثبت خدمت"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
