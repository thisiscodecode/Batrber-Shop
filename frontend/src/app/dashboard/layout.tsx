"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !token) router.push("/login");
  }, [token, loading, router]);

  if (loading || !token) {
    return (
      <div className="dark-panel flex min-h-screen items-center justify-center text-surface-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-2xl bg-primary-300/20" />
          <p className="text-sm font-medium text-primary-100/70">در حال ورود...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-100">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:mr-64">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-primary-200/30 bg-surface-50/90 px-5 py-3 backdrop-blur-xl lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary-200/40 bg-white text-espresso-800"
            aria-label="باز کردن منو"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <p className="text-sm font-black text-espresso-900">BookEase Barber</p>
          <div className="w-10" />
        </header>

        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  );
}
