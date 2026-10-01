import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Eye, Cookie, Server, UserCheck, Mail } from 'lucide-react';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Chính Sách Bảo Mật | Vietlott Dashboard',
  description: 'Chính sách bảo mật và quyền riêng tư của Vietlott Dashboard. Tìm hiểu cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn.',
};

const sections = [
  {
    icon: Eye,
    color: 'emerald',
    title: '1. Thông Tin Chúng Tôi Thu Thập',
    content: `Khi bạn truy cập Vietlott Dashboard, chúng tôi có thể thu thập các loại thông tin sau:

• **Thông tin kỹ thuật tự động**: Địa chỉ IP, loại trình duyệt, hệ điều hành, thời gian truy cập, các trang đã xem và thời lượng phiên truy cập.
• **Dữ liệu sử dụng (Analytics)**: Chúng tôi sử dụng Vercel Analytics để phân tích hành vi truy cập tổng hợp (aggregate) nhằm cải thiện trải nghiệm người dùng. Dữ liệu này hoàn toàn ẩn danh.
• **Dữ liệu lưu trữ cục bộ (LocalStorage)**: Một mã định danh ngẫu nhiên (Client ID) được lưu trong trình duyệt của bạn để cá nhân hóa tính năng dự đoán số. Mã này không liên kết với bất kỳ thông tin cá nhân nào.
• Chúng tôi **KHÔNG** yêu cầu đăng ký tài khoản, **KHÔNG** thu thập tên, email, số điện thoại hoặc thông tin tài chính cá nhân.`,
  },
  {
    icon: Cookie,
    color: 'amber',
    title: '2. Cookie & Công Nghệ Theo Dõi',
    content: `• **Cookie của bên thứ ba**: Google AdSense sử dụng cookie để hiển thị quảng cáo phù hợp dựa trên lịch sử duyệt web của bạn. Bạn có thể quản lý tùy chọn quảng cáo tại [Cài đặt Quảng cáo Google](https://adssettings.google.com/).
• **Vercel Analytics**: Cookie phiên ẩn danh để đo lường hiệu suất trang web.
• **LocalStorage**: Lưu trữ Client ID và tùy chọn giao diện. Dữ liệu này chỉ tồn tại trên thiết bị của bạn.

Bạn có thể vô hiệu hóa cookie bất kỳ lúc nào thông qua cài đặt trình duyệt. Tuy nhiên, việc này có thể ảnh hưởng đến một số tính năng cá nhân hóa.`,
  },
  {
    icon: Server,
    color: 'blue',
    title: '3. Cách Chúng Tôi Sử Dụng Thông Tin',
    content: `Thông tin thu thập được sử dụng cho các mục đích sau:

• Cung cấp và duy trì dịch vụ phân tích thống kê xổ số.
• Cải thiện tốc độ tải trang, giao diện và trải nghiệm người dùng dựa trên dữ liệu analytics tổng hợp.
• Hiển thị quảng cáo phù hợp thông qua Google AdSense để duy trì dịch vụ miễn phí.
• Phát hiện và ngăn chặn lạm dụng hoặc truy cập bất hợp pháp vào hệ thống.

Chúng tôi **KHÔNG BAO GIỜ** bán, cho thuê hoặc chia sẻ thông tin cá nhân của bạn cho bên thứ ba vì mục đích thương mại.`,
  },
  {
    icon: UserCheck,
    color: 'purple',
    title: '4. Quyền Của Bạn',
    content: `Theo các quy định về bảo vệ dữ liệu cá nhân, bạn có các quyền sau:

• **Quyền truy cập**: Yêu cầu xem thông tin chúng tôi lưu giữ về bạn.
• **Quyền xóa**: Yêu cầu xóa dữ liệu cá nhân (bao gồm xóa LocalStorage trong trình duyệt).
• **Quyền từ chối**: Tắt cookie, tắt quảng cáo cá nhân hóa qua cài đặt Google.
• **Quyền khiếu nại**: Liên hệ chúng tôi nếu bạn cho rằng dữ liệu của mình bị xử lý sai.

Vì hệ thống của chúng tôi chủ yếu thu thập dữ liệu ẩn danh, phần lớn thông tin không thể liên kết về cá nhân cụ thể.`,
  },
  {
    icon: ShieldCheck,
    color: 'teal',
    title: '5. Bảo Mật Dữ Liệu',
    content: `Chúng tôi áp dụng các biện pháp bảo mật sau:

• Toàn bộ kết nối được mã hóa qua giao thức **HTTPS/TLS**.
• Ứng dụng được triển khai trên nền tảng **Vercel** với cơ sở hạ tầng bảo mật đạt chuẩn SOC 2 Type II.
• Dữ liệu xổ số được lấy từ nguồn công khai (Google Sheets) và không chứa thông tin cá nhân.
• Mã nguồn được kiểm tra bảo mật định kỳ.`,
  },
  {
    icon: Mail,
    color: 'rose',
    title: '6. Liên Hệ',
    content: `Nếu bạn có câu hỏi về chính sách bảo mật hoặc muốn thực hiện quyền riêng tư của mình, vui lòng liên hệ:

• **Email**: dangochinh.work@gmail.com
• **Website**: [vietlott-dashboard.vercel.app](https://vietlott-dashboard.vercel.app)

Chính sách này có hiệu lực từ ngày đăng tải và có thể được cập nhật theo thời gian. Phiên bản mới nhất luôn có sẵn tại trang này.`,
  },
];

const colorMap = {
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  teal: { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/20' },
  rose: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' },
};

export default function PrivacyPolicyPage() {
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
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h1 className="text-lg font-bold">Chính Sách Bảo Mật</h1>
          </div>
          <div className="w-20" /> {/* Spacer */}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-10">
          <p className="text-sm text-gray-500 mb-2">Cập nhật lần cuối: Tháng 5, 2026</p>
          <p className="text-gray-400 leading-relaxed">
            Chào mừng bạn đến với <strong className="text-white">Vietlott Dashboard</strong>. 
            Chúng tôi cam kết bảo vệ quyền riêng tư và dữ liệu cá nhân của bạn. 
            Chính sách này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin khi bạn sử dụng dịch vụ.
          </p>
        </div>

        <div className="space-y-6">
          {sections.map((section, index) => {
            const Icon = section.icon;
            const colors = colorMap[section.color];
            return (
              <section
                key={index}
                className={`${colors.bg} border ${colors.border} rounded-2xl p-6 md:p-8`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 ${colors.bg} rounded-lg`}>
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <h2 className="text-lg font-bold text-white">{section.title}</h2>
                </div>
                <div className="text-sm text-gray-400 leading-relaxed whitespace-pre-line prose prose-invert prose-sm max-w-none">
                  {section.content.split('\n').map((line, i) => (
                    <p key={i} className="mb-1" dangerouslySetInnerHTML={{
                      __html: line
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-200">$1</strong>')
                        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-emerald-400 hover:underline">$1</a>')
                    }} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
