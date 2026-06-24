"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

const services = [
  { title: "فید و سایه‌زنی دقیق", text: "اجرای فید کلاسیک، مدرن و اسکین‌فید با فرم‌دهی تمیز دور سر.", time: "۴۵ دقیقه" },
  { title: "اصلاح صورت با حوله گرم", text: "تیغ تمیز، خط ریش منظم، افترشیو و پایان کار بدون التهاب.", time: "۳۰ دقیقه" },
  { title: "کوتاهی و استایل روزانه", text: "مشاوره فرم مو، کوتاهی متناسب با چهره و حالت‌دهی نهایی.", time: "۴۰ دقیقه" },
  { title: "پکیج داماد", text: "کوتاهی، اصلاح صورت، ابرو، ماسک و آماده‌سازی کامل روز مراسم.", time: "۹۰ دقیقه" },
];

const features = [
  "رزرو سریع از طریق ربات تلگرام",
  "تأیید یا رد نوبت از پنل مدیریت",
  "نمایش قیمت و مدت هر خدمت قبل از رزرو",
  "خروجی Excel برای گزارش روزانه و ماهانه",
];

export default function HomePage() {
  const { token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && token) router.push("/dashboard");
  }, [token, loading, router]);

  if (loading || token) {
    return (
      <div className="min-h-screen dark-panel flex items-center justify-center text-surface-50">
        <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-2xl border border-primary-300/30 bg-primary-400/10 flex items-center justify-center shadow-gold">
            <svg className="h-6 w-6 text-primary-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.1 6.7-8.7 8.7a3 3 0 1 0 2.1 2.1l8.7-8.7" />
              <path strokeLinecap="round" strokeLinejoin="round" d="m9.9 6.7 8.7 8.7a3 3 0 1 1-2.1 2.1L7.8 8.8" />
            </svg>
          </div>
          <p className="text-sm text-primary-100">در حال آماده‌سازی پنل آرایشگاه...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden">
      <section className="relative dark-panel text-surface-50">
        <div className="absolute inset-0 opacity-20 barber-stripes" />
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-primary-400/20 blur-3xl" />
        <div className="absolute right-1/2 top-0 h-96 w-96 rounded-full bg-white/5 blur-3xl" />

        <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary-200/20 bg-primary-300/10 shadow-gold">
              <svg className="h-6 w-6 text-primary-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.1 6.7-8.7 8.7a3 3 0 1 0 2.1 2.1l8.7-8.7" />
                <path strokeLinecap="round" strokeLinejoin="round" d="m9.9 6.7 8.7 8.7a3 3 0 1 1-2.1 2.1L7.8 8.8" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-black tracking-tight">BookEase Barber</p>
              <p className="text-xs text-primary-100/75">نوبت‌دهی حرفه‌ای آرایشگاه</p>
            </div>
          </div>
          <nav className="hidden items-center gap-8 text-sm text-surface-100/80 md:flex">
            <a href="#services" className="hover:text-primary-100 transition-colors">خدمات</a>
            <a href="#experience" className="hover:text-primary-100 transition-colors">تجربه مشتری</a>
            <Link href="/login" className="rounded-full border border-primary-200/30 px-5 py-2 font-bold text-primary-100 hover:bg-primary-200/10 transition-all">
              ورود مدیریت
            </Link>
          </nav>
        </header>

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-6 pb-16 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-20 lg:pt-14">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-200/20 bg-white/5 px-4 py-2 text-sm text-primary-100 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-primary-300" />
              تجربه‌ای لوکس از اولین کلیک تا آخرین تیغ
            </div>
            <h1 className="max-w-3xl text-2xl font-black leading-[1.35] tracking-tight md:text-4xl">
              آرایشگاه مردانه‌ای که <span className="text-gold-gradient">نوبت‌هایش دقیق، شیک و بی‌دردسر</span> مدیریت می‌شود.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-surface-100/78">
              مشتری خدمت را می‌بیند، زمان مناسب را انتخاب می‌کند و درخواست نوبت می‌فرستد؛ شما از پنل مدیریت، همه چیز را حرفه‌ای تأیید، پیگیری و گزارش‌گیری می‌کنید.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/login" className="btn-gold inline-flex items-center justify-center rounded-2xl px-7 py-4 text-sm font-black transition-all">
                ورود به پنل مدیریت
              </Link>
              <a href="#services" className="inline-flex items-center justify-center rounded-2xl border border-white/14 bg-white/6 px-7 py-4 text-sm font-bold text-surface-50 backdrop-blur transition-all hover:bg-white/10">
                مشاهده خدمات آرایشگاه
              </a>
            </div>
            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
                <p className="text-2xl font-black text-primary-100">۴</p>
                <p className="mt-1 text-xs text-surface-100/70">مرحله رزرو ساده</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
                <p className="text-2xl font-black text-primary-100">۷ روز</p>
                <p className="mt-1 text-xs text-surface-100/70">انتخاب زمان آینده</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
                <p className="text-2xl font-black text-primary-100">Excel</p>
                <p className="mt-1 text-xs text-surface-100/70">گزارش آماده مدیر</p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-primary-300/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-2xl border border-primary-200/18 bg-[#17130f]/80 p-4 shadow-2xl backdrop-blur">
              <div className="rounded-xl bg-surface-50 p-4 text-espresso-900 shadow-glass-lg">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-primary-700">نوبت امروز</p>
                    <h2 className="mt-0.5 text-lg font-black">صف مشتری‌ها مرتب است</h2>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">آنلاین</span>
                </div>

                <div className="grid gap-2.5">
                  {[
                    ["۰۹:۰۰", "فید و کوتاهی", "آرمان رضایی", "تأیید شده"],
                    ["۱۰:۳۰", "اصلاح صورت", "سامان کریمی", "در انتظار"],
                    ["۱۲:۰۰", "پکیج داماد", "نیما شریفی", "تأیید شده"],
                  ].map(([time, service, name, status]) => (
                    <div key={`${time}-${name}`} className="flex items-center justify-between rounded-xl border border-primary-100 bg-white px-3 py-2.5 shadow-sm">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-espresso-900 text-xs font-black text-primary-100" dir="ltr">{time}</div>
                        <div>
                          <p className="text-sm font-black text-espresso-900">{service}</p>
                          <p className="text-[10px] text-espresso-500">{name}</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-primary-50 px-3 py-1 text-[11px] font-black text-primary-800">{status}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-xl bg-espresso-900 p-4 text-surface-50">
                  <p className="text-xs text-primary-100">پیشنهاد ویژه امروز</p>
                  <div className="mt-2 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-sm font-black">کوتاهی + اصلاح صورت</p>
                      <p className="mt-0.5 text-[10px] text-surface-100/65">۴۵ دقیقه، مناسب قبل از جلسه یا مهمانی</p>
                    </div>
                    <p className="whitespace-nowrap text-sm font-black text-primary-100">۲۸۰٬۰۰۰ تومان</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black text-primary-700">خدمات واقعی آرایشگاه</p>
            <h2 className="mt-2 text-3xl font-black text-espresso-900 md:text-4xl">منوی خدماتی که اعتماد می‌سازد</h2>
          </div>
          <p className="max-w-xl leading-8 text-espresso-500">
            متن خدمات طوری نوشته شده که مشتری دقیقاً بداند چه چیزی دریافت می‌کند، چقدر زمان می‌برد و چرا باید همین حالا نوبت بگیرد.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <article key={service.title} className="luxury-panel card-hover rounded-2xl p-5">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-espresso-900 text-primary-100 shadow-card">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.1 6.7-8.7 8.7a3 3 0 1 0 2.1 2.1l8.7-8.7" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 5h5M18.5 2.5v5" />
                </svg>
              </div>
              <h3 className="text-base font-black text-espresso-900">{service.title}</h3>
              <p className="mt-2 min-h-16 leading-7 text-sm text-espresso-500">{service.text}</p>
              <div className="mt-4 flex items-center justify-between border-t border-primary-200/50 pt-3">
                <span className="text-xs font-bold text-espresso-400">زمان تقریبی</span>
                <span className="font-black text-primary-700">{service.time}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="experience" className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">
        <div className="dark-panel overflow-hidden rounded-2xl p-6 text-surface-50 md:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-black text-primary-100">تجربه مشتری و مدیر</p>
              <h2 className="mt-3 text-3xl font-black leading-[1.45] md:text-4xl">ظاهر سایت لوکس است، اما کار اصلی پشت صحنه انجام می‌شود.</h2>
              <p className="mt-5 leading-9 text-surface-100/72">
                نوبت‌ها در یک جریان شفاف ثبت می‌شوند، مدیر پیام تأیید یا رد می‌فرستد و مشتری حس می‌کند با یک آرایشگاه منظم و قابل اعتماد طرف است.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {features.map((feature) => (
                <div key={feature} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-300/15 text-primary-100">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                    </svg>
                  </div>
                  <p className="font-bold leading-8">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
