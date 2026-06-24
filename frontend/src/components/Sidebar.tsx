"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import clsx from "clsx";

const navItems = [
  { href: "/dashboard", label: "نمای امروز", icon: "home", exact: true },
  { href: "/dashboard/bookings", label: "نوبت‌ها", icon: "calendar" },
  { href: "/dashboard/services", label: "منوی خدمات", icon: "scissors" },
  { href: "/dashboard/export", label: "گزارش و خروجی", icon: "download" },
];

const iconMap: Record<string, JSX.Element> = {
  home: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 11.5 12 4l9 7.5M5.5 10.5V20h13v-9.5M9 20v-6h6v6" />
    </svg>
  ),
  calendar: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 4v3m8-3v3M5 10h14M6 6h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />
    </svg>
  ),
  scissors: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.1 6.7-8.7 8.7a3 3 0 1 0 2.1 2.1l8.7-8.7" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m9.9 6.7 8.7 8.7a3 3 0 1 1-2.1 2.1L7.8 8.8" />
    </svg>
  ),
  download: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v11m0 0 4-4m-4 4-4-4M5 19h14" />
    </svg>
  ),
};

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ open = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <>
      {open && onClose && (
        <div
          className="fixed inset-0 z-40 bg-espresso-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          "fixed bottom-0 right-0 top-0 z-50 flex w-64 flex-col overflow-y-auto border-l border-primary-200/10 bg-espresso-900 text-surface-50 shadow-2xl transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}
      >
        <div className="absolute inset-0 opacity-[0.06] barber-stripes" />

        <div className="relative border-b border-white/10 p-5">
          <Link href="/" className="flex items-center gap-3" onClick={onClose}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary-200/20 bg-primary-300/10 text-primary-100 shadow-gold">
              {iconMap.scissors}
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight">BookEase Barber</h1>
              <p className="mt-0.5 text-[10px] text-primary-100/60">پنل مدیریت</p>
            </div>
          </Link>
        </div>

        <nav className="relative flex-1 space-y-1 p-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={clsx(
                "sidebar-item flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all hover:bg-white/[0.06] hover:text-primary-100",
                isActive(pathname, item.href, item.exact) ? "active" : "text-surface-100/65"
              )}
            >
              {iconMap[item.icon]}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="relative border-t border-white/10 p-3">
          <button
            onClick={logout}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-bold text-surface-100/60 transition-all hover:bg-red-500/10 hover:text-red-200"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0-4-4m4 4H8m5 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v2" />
            </svg>
            <span>خروج</span>
          </button>
        </div>
      </aside>
    </>
  );
}
