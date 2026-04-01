import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Vietlott Dashboard - Thay phân đổi thận",
  description: "Trang tổng hợp thống kê và phân tích tần suất xổ số Vietlott tự động cập nhật.",
  icons: {
    icon: "https://vietlott.vn/images/Logo-Vietlott.png",
  }
};

export default function RootLayout({ children }) {
  const adsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === 'true';
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google AdSense — chỉ load khi NEXT_PUBLIC_ADS_ENABLED=true */}
        {adsEnabled && adsenseClient && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        {children}
      </body>
    </html>
  );
}
