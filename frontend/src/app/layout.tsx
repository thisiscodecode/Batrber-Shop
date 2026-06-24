import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "پنل رزرو آرایشگاه | BookEase Barber",
  description: "وب‌سایت و داشبورد مدیریت نوبت برای آرایشگاه مردانه، خدمات اصلاح، فید، ریش و پکیج‌های مراقبتی.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
