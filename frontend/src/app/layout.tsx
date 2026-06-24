import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-vazirmatn",
});

export const metadata: Metadata = {
  title: "پنل رزرو آرایشگاه | BookEase Barber",
  description: "پنل مدیریت نوبت آرایشگاه — رزرو از تلگرام، تأیید نوبت، مدیریت خدمات و خروجی Excel.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className="font-vazirmatn antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
