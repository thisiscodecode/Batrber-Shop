"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";

function ScissorsIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.1 6.7-8.7 8.7a3 3 0 1 0 2.1 2.1l8.7-8.7" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m9.9 6.7 8.7 8.7a3 3 0 1 1-2.1 2.1L7.8 8.8" />
    </svg>
  );
}

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
    <main className="dark-panel relative min-h-screen px-4 py-8 text-surface-50">
      <div className="absolute inset-0 opacity-[0.12] barber-stripes" />
      <div className="hero-glow absolute left-1/4 top-0 h-96 w-96 rounded-full blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-primary-200/12 bg-white/[0.04] shadow-2xl backdrop-blur-xl lg:grid-cols-2">
          {/* Left panel */}
          <section className="hidden flex-col justify-between p-10 lg:flex">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary-200/20 bg-primary-300/10 text-primary-200 shadow-gold">
                <ScissorsIcon />
              </div>
              <div>
                <p className="text-base font-black">BookEase Barber</p>
                <p className="text-[11px] text-primary-100/60">پنل مدیریت</p>
              </div>
            </Link>

            <div>
              <p className="mb-4 inline-flex rounded-full border border-primary-200/15 bg-white/[0.04] px-4 py-2 text-xs font-bold text-primary-100">
                ورود مدیر آرایشگاه
              </p>
              <h1 className="text-3xl font-black leading-[1.4] tracking-tight">
                مدیریت نوبت‌های آرایشگاه
              </h1>
              <p className="mt-5 text-sm leading-8 text-surface-100/60">
                درخواست‌های رزرو از تلگرام اینجا نمایش داده می‌شود. می‌توانید نوبت را تأیید یا رد کنید و گزارش بگیرید.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {["درخواست‌ها", "تأیید/رد", "گزارش"].map((step, i) => (
                <div key={step} className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4">
                  <p className="text-xl font-black text-primary-100">۰{ i + 1 }</p>
                  <p className="mt-1 text-[11px] text-surface-100/50">{step}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Form */}
          <section className="bg-surface-50 p-7 text-espresso-900 sm:p-10">
            <div className="mb-8 lg:hidden">
              <Link href="/" className="inline-flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-espresso-900 text-primary-100">
                  <ScissorsIcon className="h-5 w-5" />
                </div>
                <p className="text-base font-black">BookEase Barber</p>
              </Link>
            </div>

            <div className="mb-7">
              <p className="text-xs font-black uppercase tracking-widest text-primary-600">خوش آمدید</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight">ورود به پنل</h2>
              <p className="mt-2 text-sm leading-7 text-espresso-500">نام کاربری و رمز عبور مدیر را وارد کنید.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-bold text-espresso-800">نام کاربری</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field"
                  placeholder="admin"
                  autoComplete="username"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-espresso-800">رمز عبور</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-gold flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-black disabled:cursor-not-allowed disabled:opacity-60"
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

            <Link href="/" className="mt-6 block text-center text-xs font-bold text-primary-700 hover:text-primary-800">
              ← بازگشت به صفحه اصلی
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
