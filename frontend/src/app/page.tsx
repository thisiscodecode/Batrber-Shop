"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

const services = [
  { title: "فید و سایه‌زنی", text: "فید کلاسیک، مدرن یا اسکین‌فید با فرم‌دهی دور سر.", time: "۴۵ دقیقه", price: "۲۴۰٬۰۰۰" },
  { title: "اصلاح صورت", text: "اصلاح با تیغ، خط‌گیری ریش و پایان کار با افترشیو.", time: "۳۰ دقیقه", price: "۱۸۰٬۰۰۰" },
  { title: "کوتاهی مو", text: "کوتاهی متناسب با فرم صورت و حالت‌دهی در پایان.", time: "۴۰ دقیقه", price: "۳۹۰٬۰۰۰" },
  { title: "پکیج داماد", text: "کوتاهی، اصلاح صورت، ابرو و آماده‌سازی برای روز مراسم.", time: "۹۰ دقیقه", price: "۷۵۰٬۰۰۰" },
];

const features = [
  { title: "رزرو از تلگرام", desc: "مشتری از ربات، خدمت و زمان را انتخاب می‌کند." },
  { title: "تأیید در پنل", desc: "مدیر نوبت را تأیید یا رد می‌کند." },
  { title: "نمایش قیمت", desc: "قیمت و مدت هر خدمت قبل از رزرو مشخص است." },
  { title: "خروجی Excel", desc: "لیست نوبت‌ها را می‌توانید دانلود کنید." },
];

function ScissorsIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.1 6.7-8.7 8.7a3 3 0 1 0 2.1 2.1l8.7-8.7" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m9.9 6.7 8.7 8.7a3 3 0 1 1-2.1 2.1L7.8 8.8" />
    </svg>
  );
}

export default function HomePage() {
  const { token, loading } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && token) router.push("/dashboard");
  }, [token, loading, router]);

  if (loading || token) {
    return (
      <div className="dark-panel flex min-h-screen items-center justify-center text-surface-50">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary-300/30 bg-primary-400/10 shadow-gold">
            <ScissorsIcon className="h-7 w-7 text-primary-200 animate-pulse" />
          </div>
          <p className="text-sm font-medium text-primary-100/80">در حال آماده‌سازی...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden">
      {/* Hero */}
      <section className="relative dark-panel min-h-screen text-surface-50">
        <div className="absolute inset-0 opacity-[0.12] barber-stripes" />
        <div className="hero-glow absolute -left-32 top-20 h-[500px] w-[500px] rounded-full blur-3xl" />
        <div className="absolute -right-20 top-1/3 h-72 w-72 rounded-full bg-white/[0.03] blur-3xl" />

        {/* Header */}
        <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary-200/20 bg-primary-300/10 text-primary-200 shadow-gold">
              <ScissorsIcon />
            </div>
            <div>
              <p className="text-base font-black tracking-tight">BookEase Barber</p>
              <p className="text-[11px] text-primary-100/60">سیستم رزرو نوبت</p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#services" className="text-sm font-medium text-surface-100/70 transition-colors hover:text-primary-100">خدمات</a>
            <a href="#experience" className="text-sm font-medium text-surface-100/70 transition-colors hover:text-primary-100">ویژگی‌ها</a>
            <Link href="/login" className="rounded-full border border-primary-200/25 px-5 py-2.5 text-sm font-bold text-primary-100 transition-all hover:bg-primary-200/10">
              ورود مدیریت
            </Link>
          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 md:hidden"
            aria-label="منو"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </header>

        {menuOpen && (
          <div className="relative z-20 mx-5 mb-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl md:hidden">
            <nav className="flex flex-col gap-1">
              <a href="#services" onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 text-sm font-medium text-surface-100/80 hover:bg-white/5">خدمات</a>
              <a href="#experience" onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 text-sm font-medium text-surface-100/80 hover:bg-white/5">ویژگی‌ها</a>
              <Link href="/login" className="btn-gold mt-2 rounded-xl px-4 py-3 text-center text-sm font-black">ورود مدیریت</Link>
            </nav>
          </div>
        )}

        {/* Hero content */}
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 pt-8 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:pb-28 lg:pt-12">
          <div>
            <div className="animate-fade-up mb-7 inline-flex items-center gap-2.5 rounded-full border border-primary-200/15 bg-white/[0.04] px-4 py-2 text-xs font-bold text-primary-100 backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-300 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-300" />
              </span>
              سیستم رزرو آنلاین
            </div>

            <h1 className="animate-fade-up-delay-1 max-w-xl text-3xl font-black leading-[1.35] tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.3]">
              مدیریت نوبت آرایشگاه از طریق تلگرام
            </h1>

            <p className="animate-fade-up-delay-2 mt-6 max-w-lg text-base leading-8 text-surface-100/65 sm:text-lg">
              مشتری از ربات تلگرام نوبت می‌گیرد. شما در این پنل درخواست‌ها را می‌بینید، تأیید یا رد می‌کنید و در صورت نیاز گزارش می‌گیرید.
            </p>

            <div className="animate-fade-up-delay-3 mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/login" className="btn-gold inline-flex items-center justify-center rounded-2xl px-8 py-4 text-sm font-black">
                ورود به پنل مدیریت
              </Link>
              <a href="#services" className="inline-flex items-center justify-center rounded-2xl border border-white/12 bg-white/[0.04] px-8 py-4 text-sm font-bold text-surface-50 backdrop-blur transition-all hover:bg-white/[0.08]">
                مشاهده خدمات
              </a>
            </div>

            <div className="animate-fade-up-delay-3 mt-10 grid max-w-md grid-cols-3 gap-3">
              {[
                { val: "۴", label: "مرحله ثبت نوبت" },
                { val: "۷", label: "روز برای انتخاب" },
                { val: "Excel", label: "خروجی گزارش" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 backdrop-blur">
                  <p className="text-2xl font-black text-primary-100">{s.val}</p>
                  <p className="mt-1 text-[11px] font-medium text-surface-100/50">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Preview card */}
          <div className="animate-fade-up-delay-2 relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary-300/15 blur-2xl" />
            <div className="animate-float relative overflow-hidden rounded-3xl border border-primary-200/15 bg-[#1a1510]/90 p-1.5 shadow-glow backdrop-blur">
              <div className="rounded-[1.35rem] bg-surface-50 p-5 text-espresso-900 shadow-glass-lg">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-primary-700">امروز</p>
                    <h2 className="mt-0.5 text-lg font-black">نوبت‌های امروز</h2>
                  </div>
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-black text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    آنلاین
                  </span>
                </div>

                <div className="space-y-2.5">
                  {[
                    ["۰۹:۰۰", "فید کلاسیک", "آرمان ر.", "تأیید", "emerald"],
                    ["۱۰:۳۰", "اصلاح صورت", "سامان ک.", "انتظار", "amber"],
                    ["۱۲:۰۰", "پکیج داماد", "نیما ش.", "تأیید", "emerald"],
                  ].map(([time, service, name, status, color]) => (
                    <div key={time} className="flex items-center justify-between rounded-xl border border-primary-100/80 bg-white px-3.5 py-3 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-espresso-900 text-xs font-black text-primary-100" dir="ltr">{time}</div>
                        <div>
                          <p className="text-sm font-black">{service}</p>
                          <p className="text-[10px] text-espresso-400">{name}</p>
                        </div>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${color === "emerald" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                        {status}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-xl bg-espresso-900 p-4 text-surface-50">
                  <p className="text-[10px] font-bold text-primary-200/80">نمونه خدمت</p>
                  <div className="mt-2 flex items-end justify-between">
                    <div>
                      <p className="text-sm font-black">کوتاهی + اصلاح</p>
                      <p className="text-[10px] text-surface-100/50">۶۰ دقیقه</p>
                    </div>
                    <p className="text-sm font-black text-primary-100">۳۹۰٬۰۰۰ ت</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="mx-auto max-w-7xl px-5 py-20 lg:px-10">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-primary-600">خدمات</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-espresso-900 md:text-4xl">خدمات آرایشگاه</h2>
          </div>
          <p className="max-w-sm text-sm leading-7 text-espresso-500">
            قیمت و مدت زمان هر خدمت قبل از رزرو به مشتری نشان داده می‌شود.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <article key={service.title} className="luxury-panel card-hover group rounded-2xl p-6">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-espresso-900 text-primary-100 shadow-card transition-transform group-hover:scale-105">
                <ScissorsIcon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-black text-espresso-900">{service.title}</h3>
              <p className="mt-2 min-h-[4.5rem] text-sm leading-7 text-espresso-500">{service.text}</p>
              <div className="mt-5 flex items-center justify-between border-t border-primary-200/40 pt-4">
                <span className="text-xs font-medium text-espresso-400">{service.time}</span>
                <span className="text-sm font-black text-primary-700">{service.price} ت</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="experience" className="mx-auto max-w-7xl px-5 pb-20 lg:px-10">
        <div className="dark-panel overflow-hidden rounded-3xl p-8 text-surface-50 md:p-12">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-primary-200/80">امکانات</p>
              <h2 className="mt-3 text-3xl font-black leading-[1.4] tracking-tight md:text-4xl">
                چطور کار می‌کند؟
              </h2>
              <p className="mt-5 text-sm leading-8 text-surface-100/60">
                مشتری از تلگرام درخواست می‌دهد، مدیر در پنل بررسی می‌کند و نتیجه از طریق تلگرام به مشتری اطلاع داده می‌شود.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {features.map((f) => (
                <div key={f.title} className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur transition-colors hover:bg-white/[0.07]">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary-300/15 text-primary-100">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                    </svg>
                  </div>
                  <p className="font-black">{f.title}</p>
                  <p className="mt-1 text-xs leading-6 text-surface-100/55">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary-200/30 bg-surface-50/80 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 md:flex-row lg:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-espresso-900 text-primary-100">
              <ScissorsIcon className="h-4 w-4" />
            </div>
            <p className="text-sm font-black text-espresso-800">BookEase Barber</p>
          </div>
          <p className="text-xs text-espresso-400">سیستم رزرو نوبت آرایشگاه</p>
          <Link href="/login" className="text-xs font-bold text-primary-700 hover:text-primary-800">
            ورود مدیر →
          </Link>
        </div>
      </footer>
    </main>
  );
}
