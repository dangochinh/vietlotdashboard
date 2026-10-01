import Link from 'next/link';
import { ArrowLeft, Info, Zap, BarChart3, Brain, Globe, Shield, Code2, Users, HelpCircle, ChevronDown } from 'lucide-react';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Giới Thiệu | Vietlott Dashboard',
  description: 'Tìm hiểu về Vietlott Dashboard - nền tảng phân tích thống kê xổ số tự chọn hàng đầu Việt Nam. Công nghệ hiện đại, dữ liệu minh bạch, giao diện trực quan.',
};

const features = [
  {
    icon: BarChart3,
    color: 'emerald',
    title: 'Thống Kê Trực Quan',
    desc: 'Biểu đồ tần suất xuất hiện, cặp số phổ biến, bộ ba hay về, số lâu chưa xuất hiện (số gan) - tất cả được hiển thị bằng biểu đồ tương tác đẹp mắt.',
  },
  {
    icon: Brain,
    color: 'purple',
    title: 'Thuật Toán Dự Đoán',
    desc: 'Sử dụng Crypto-Secure PRNG kết hợp phân tích dữ liệu lịch sử để sinh bộ số có Coverage Score tối ưu. Tạo 5 vé cùng lúc với độ phủ số cao nhất.',
  },
  {
    icon: Zap,
    color: 'amber',
    title: 'Cập Nhật Tự Động',
    desc: 'Hệ thống GitHub Actions scraper tự động thu thập kết quả ngay sau mỗi kỳ quay thưởng. Dữ liệu luôn mới nhất mà không cần thao tác thủ công.',
  },
  {
    icon: Globe,
    color: 'blue',
    title: 'Mua Vé Qua SMS',
    desc: 'Tích hợp tính năng sinh cú pháp SMS 9969 chuẩn đại lý Vietlott. Chọn số → Nhấn nút → Tự động mở ứng dụng tin nhắn với nội dung sẵn sàng.',
  },
  {
    icon: Shield,
    color: 'teal',
    title: 'An Toàn & Minh Bạch',
    desc: 'Không thu thập thông tin cá nhân, không yêu cầu đăng ký. Dữ liệu xổ số 100% từ nguồn công khai, không qua chỉnh sửa.',
  },
  {
    icon: Code2,
    color: 'rose',
    title: 'Công Nghệ Hiện Đại',
    desc: 'Xây dựng bằng Next.js 16, React 19, Tailwind CSS v4, Recharts. Triển khai trên Vercel Edge Network với thời gian phản hồi <100ms toàn cầu.',
  },
];

const faqs = [
  {
    q: 'Vietlott Dashboard có tính phí không?',
    a: 'Hoàn toàn miễn phí. Trang web được duy trì nhờ quảng cáo Google AdSense và sự ủng hộ của cộng đồng.',
  },
  {
    q: 'Dữ liệu có chính xác không?',
    a: 'Có. Dữ liệu được thu thập tự động từ kết quả quay thưởng công bố chính thức bởi Vietlott thông qua các nguồn công khai (Minh Ngọc, Vietlott.vn). Hệ thống scraper chạy sau mỗi kỳ quay và được kiểm tra chéo.',
  },
  {
    q: 'Thuật toán dự đoán có đảm bảo trúng không?',
    a: 'KHÔNG. Xổ số tự chọn là trò chơi may rủi hoàn toàn ngẫu nhiên. Công cụ dự đoán chỉ sử dụng thuật toán CSPRNG để sinh bộ số có coverage score tốt - tức là phủ rộng nhiều tổ hợp số khác nhau. Đây KHÔNG phải lời khuyên tài chính hay cam kết trúng thưởng.',
  },
  {
    q: 'Tôi có thể sử dụng trên điện thoại không?',
    a: 'Có! Trang web được thiết kế responsive, hoạt động mượt mà trên mọi thiết bị: điện thoại, máy tính bảng, và máy tính. Bạn cũng có thể "Add to Home Screen" để sử dụng như ứng dụng native (PWA).',
  },
  {
    q: 'Làm sao liên hệ đội phát triển?',
    a: 'Gửi email đến dangochinh.work@gmail.com hoặc mở Issue trên GitHub repository của dự án.',
  },
];

const colorMap = {
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  teal: { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/20' },
  rose: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0E1217] text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0E1217]/95 backdrop-blur-xl border-b border-gray-800 shadow-2xl">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-400" />
            <h1 className="text-lg font-bold">Giới Thiệu</h1>
          </div>
          <div className="w-20" />
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-transparent to-purple-600/10" />
        <div className="max-w-4xl mx-auto px-6 py-16 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Open Source Project</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400">
            Vietlott Dashboard
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Nền tảng phân tích & thống kê xổ số tự chọn Vietlott hiện đại nhất Việt Nam. 
            Dữ liệu minh bạch, biểu đồ trực quan, công cụ dự đoán thông minh.
          </p>
        </div>
      </div>

      {/* Mission */}
      <section className="max-w-4xl mx-auto px-6 mb-16">
        <div className="bg-gradient-to-br from-[#13181E] to-[#161C24] border border-gray-800 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Users className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold">Sứ Mệnh</h2>
          </div>
          <p className="text-gray-400 leading-relaxed mb-4">
            Với hàng triệu người chơi xổ số tại Việt Nam, đa số vẫn chọn số theo cảm tính hoặc mê tín. 
            <strong className="text-white"> Vietlott Dashboard</strong> ra đời nhằm cung cấp một góc nhìn khoa học, 
            dựa trên dữ liệu thực tế, giúp người chơi hiểu rõ hơn về xu hướng các con số.
          </p>
          <p className="text-gray-400 leading-relaxed mb-4">
            Chúng tôi tin rằng dù xổ số là trò chơi may rủi, việc có thông tin và phân tích chất lượng 
            sẽ giúp người chơi đưa ra quyết định có trách nhiệm hơn — biết rõ xác suất, hiểu được rủi ro, 
            và quan trọng nhất là <strong className="text-white">chơi trong giới hạn tài chính cho phép</strong>.
          </p>
          <p className="text-gray-400 leading-relaxed">
            Dự án được phát triển và duy trì bởi đội ngũ kỹ sư phần mềm có kinh nghiệm trong lĩnh vực 
            data analytics, web development, và machine learning tại Việt Nam.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-4xl mx-auto px-6 mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Tính Năng Nổi Bật</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colors = colorMap[feature.color];
            return (
              <div
                key={index}
                className={`${colors.bg} border ${colors.border} rounded-2xl p-5 hover:scale-[1.02] transition-transform cursor-default`}
              >
                <div className={`w-10 h-10 ${colors.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${colors.text}`} />
                </div>
                <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="max-w-4xl mx-auto px-6 mb-16">
        <div className="bg-gradient-to-br from-[#13181E] to-[#161C24] border border-gray-800 rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-blue-400" />
            Công Nghệ Sử Dụng
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Next.js 16', desc: 'React Framework' },
              { name: 'React 19', desc: 'UI Library' },
              { name: 'Tailwind v4', desc: 'CSS Framework' },
              { name: 'Recharts', desc: 'Data Visualization' },
              { name: 'Vercel', desc: 'Edge Hosting' },
              { name: 'Google Sheets', desc: 'Data Source' },
              { name: 'GitHub Actions', desc: 'Auto Scraping' },
              { name: 'SWR', desc: 'Data Fetching' },
            ].map((tech, i) => (
              <div key={i} className="text-center p-3 bg-gray-800/40 rounded-xl border border-gray-700/30">
                <p className="font-bold text-sm text-white">{tech.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-6 mb-16">
        <h2 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2">
          <HelpCircle className="w-6 h-6 text-amber-400" />
          Câu Hỏi Thường Gặp
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group bg-[#13181E] border border-gray-800 rounded-xl overflow-hidden"
            >
              <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-gray-800/30 transition-colors">
                <span className="font-semibold text-sm text-gray-200 pr-4">{faq.q}</span>
                <ChevronDown className="w-5 h-5 text-gray-500 shrink-0 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-5 pb-5 text-sm text-gray-400 leading-relaxed border-t border-gray-800/60 pt-4">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
