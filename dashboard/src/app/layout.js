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
  title: "Vietlott Dashboard - Phân Tích & Dự Đoán Xổ Số",
  description: "Trang tổng hợp thống kê, dự đoán và phân tích tần suất xổ số Vietlott (Mega 6/45, Power 6/55) tự động cập nhật mỗi ngày. Cung cấp bộ số đẹp, soi cầu nhanh chuẩn xác.",
  manifest: "/manifest.json",
  keywords: ["Vietlott", "Mega 6/45", "Power 6/55", "Xổ số", "Dự đoán Vietlott", "Thống kê Vietlott", "KQXS Vietlott", "Vietlott Dashboard", "Phân tích xổ số"],
  authors: [{ name: "Vietlott Dashboard" }],
  creator: "Vietlott Dashboard",
  themeColor: "#0E1217", // Ensure splash screen and address bar match the theme
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Vietlott Dashboard",
  },
  openGraph: {
    title: "Vietlott Dashboard - Phân Tích & Dự Đoán Xổ Số",
    description: "Công cụ thống kê, dự đoán và phân tích tần suất xổ số Vietlott trực quan. Giao diện nhanh, đẹp, dữ liệu cập nhật liên tục.",
    url: "https://vietlott-dashboard.vercel.app",
    siteName: "Vietlott Dashboard",
    images: [
      {
        url: "/og-image.png",
        width: 1024,
        height: 1024,
        alt: "Vietlott Dashboard Logo",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vietlott Dashboard - Cập nhật liên tục",
    description: "Xem tần suất vắng mặt, cặp số hot nhất hiện tại và tự động sinh vé Vietlott cực chuẩn.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Xác minh sở hữu AdSense */}
        <meta name="google-adsense-account" content="ca-pub-9806354177150523" />
        {/* Google AdSense Script */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9806354177150523"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
