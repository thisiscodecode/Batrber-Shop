"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !token) router.push("/login");
  }, [token, loading, router]);

  if (loading || !token) {
    return (
      <div className="min-h-screen dark-panel flex items-center justify-center text-surface-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-2xl bg-primary-300/20" />
          <p className="text-sm text-primary-100">در حال ورود به داشبورد...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-100">
      <Sidebar />
      <main className="mr-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}
