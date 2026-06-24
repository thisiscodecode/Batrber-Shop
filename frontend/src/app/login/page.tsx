"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await api.auth.login(username, password);
      login(result.access_token, result.refresh_token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "نام کاربری یا رمز عبور درست نیست.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen dark-panel px-4 py-6 text-surface-50">
      <div className="absolute inset-0 opacity-20 barber-stripes" />
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-primary-200/15 bg-white/[0.06] shadow-2xl backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]">
            <section className="hidden p-8 lg:block">
            <Link href="/" className="mb-10 inline-flex items-center gap-3 text-surface-50">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary-200/20 bg-primary-300/10 shadow-gold">
                <svg className="h-6 w-6 text-primary-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.1 6.7-8.7 8.7a3 3 0 1 0 2.1 2.1l8.7-8.7" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="m9.9 6.7 8.7 8.7a3 3 0 1 1-2.1 2.1L7.8 8.8" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-black">BookEase Barber</p>
                <p className="text-xs text-primary-100/75">رزرو حرفه‌ای آرایشگاه</p>
              </div>
            </Link>

            <div className="max-w-lg">
              <p className="mb-4 inline-flex rounded-full border border-primary-200/20 bg-white/5 px-4 py-2 text-sm font-bold text-primary-100">
                پنل اختصاصی مدیر آرایشگاه
              </p>
              <h1 className="text-2xl font-black leading-[1.45] md:text-3xl">
                هر نوبت، هر مشتری و هر خدمت را با حس یک آرایشگاه لوکس مدیریت کنید.
              </h1>
              <p className="mt-5 leading-9 text-surface-100/72">
                درخواست‌های رزرو از تلگرام وارد پنل می‌شوند؛ شما زمان‌بندی را بررسی می‌کنید، پیام تأیید می‌فرستید و خدمات آرایشگاه را همیشه مرتب نگه می‌دارید.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4">
              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5">
                <p className="text-2xl font-black text-primary-100">۰۱</p>
                <p className="mt-2 text-xs leading-6 text-surface-100/65">بررسی درخواست‌های جدید</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5">
                <p className="text-2xl font-black text-primary-100">۰۲</p>
                <p className="mt-2 text-xs leading-6 text-surface-100/65">تأیید سریع نوبت‌ها</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5">
                <p className="text-2xl font-black text-primary-100">۰۳</p>
                <p className="mt-2 text-xs leading-6 text-surface-100/65">گزارش Excel روزانه</p>
              </div>
            </div>
          </section>

          <section className="bg-surface-50 p-6 text-espresso-900 sm:p-8 lg:p-8">
            <div className="mb-6">
              <Link href="/" className="inline-flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-espresso-900 text-primary-100 shadow-card">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.1 6.7-8.7 8.7a3 3 0 1 0 2.1 2.1l8.7-8.7" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.9 6.7 8.7 8.7a3 3 0 1 1-2.1 2.1L7.8 8.8" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-black">BookEase Barber</p>
                  <p className="text-xs text-espresso-500">ورود مدیریت</p>
                </div>
              </Link>
            </div>

            <div className="mb-6">
              <p className="text-sm font-black text-primary-700">خوش آمدید</p>
              <h2 className="mt-2 text-2xl font-black">ورود به پنل مدیریت</h2>
              <p className="mt-3 leading-7 text-espresso-500">برای دیدن نوبت‌ها، مدیریت خدمات و خروجی گرفتن از رزروها وارد شوید.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-black text-espresso-800">نام کاربری</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-2xl border border-primary-200/70 bg-white px-4 py-4 text-espresso-900 outline-none transition-all placeholder:text-espresso-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                  placeholder="مثلاً admin"
                  autoComplete="username"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-espresso-800">رمز عبور</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-primary-200/70 bg-white px-4 py-4 text-espresso-900 outline-none transition-all placeholder:text-espresso-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                  placeholder="رمز عبور مدیریت"
                  autoComplete="current-password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-gold flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-black transition-all disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    در حال ورود...
                  </>
                ) : (
                  "ورود به داشبورد"
                )}
              </button>
            </form>

            <div className="mt-6 rounded-2xl border border-primary-200/60 bg-primary-50 p-4">
              <p className="text-sm font-black text-espresso-800">نکته امنیتی</p>
              <p className="mt-2 text-sm leading-7 text-espresso-500">
                این بخش مخصوص مدیر آرایشگاه است. اطلاعات ورود را فقط در اختیار افراد مسئول پذیرش و مدیریت قرار دهید.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
