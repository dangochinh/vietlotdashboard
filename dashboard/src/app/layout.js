import { Geist, Geist_Mono } from "next/font/google";
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
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
