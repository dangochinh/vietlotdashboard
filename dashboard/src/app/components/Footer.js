import React from 'react';
import Link from 'next/link';
import { ShieldCheck, FileText, Info, BarChart3, Wand2, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-gray-800/60 bg-gradient-to-b from-transparent to-[#0A0D12]">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Top section - Brand + Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">Vietlott Dashboard</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Nền tảng phân tích thống kê xổ số tự chọn Vietlott hàng đầu Việt Nam. Cập nhật dữ liệu tự động, biểu đồ trực quan, công cụ dự đoán thông minh.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Trang Chính</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-400 transition-colors group">
                <BarChart3 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Bảng Thống Kê
              </Link>
              <Link href="/predict" className="flex items-center gap-2 text-sm text-gray-500 hover:text-purple-400 transition-colors group">
                <Wand2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Dự Đoán Số
              </Link>
              <Link href="/about" className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-400 transition-colors group">
                <Info className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Giới Thiệu
              </Link>
            </nav>
          </div>

          {/* Legal Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Pháp Lý</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/privacy" className="flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-400 transition-colors group">
                <ShieldCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Chính Sách Bảo Mật
              </Link>
              <Link href="/terms" className="flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-400 transition-colors group">
                <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Điều Khoản Sử Dụng
              </Link>
            </nav>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800/60 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs text-gray-600">
              © {currentYear} Vietlott Dashboard. All rights reserved.
            </p>
            <p className="text-xs text-gray-600 flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" /> in Vietnam
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
