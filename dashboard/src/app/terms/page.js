import Link from 'next/link';
import { ArrowLeft, FileText, Scale, AlertTriangle, Ban, Gavel, BookOpen } from 'lucide-react';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Điều Khoản Sử Dụng | Vietlott Dashboard',
  description: 'Điều khoản và điều kiện sử dụng dịch vụ Vietlott Dashboard. Vui lòng đọc kỹ trước khi sử dụng trang web.',
};

const sections = [
  {
    icon: BookOpen,
    color: 'blue',
    title: '1. Chấp Nhận Điều Khoản',
    content: `Bằng việc truy cập và sử dụng trang web Vietlott Dashboard ("Dịch vụ"), bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu trong tài liệu này. Nếu bạn không đồng ý với bất kỳ phần nào của điều khoản, vui lòng ngừng sử dụng Dịch vụ.

Dịch vụ được cung cấp miễn phí và có thể thay đổi hoặc ngừng hoạt động bất kỳ lúc nào mà không cần thông báo trước.`,
  },
  {
    icon: Scale,
    color: 'purple',
    title: '2. Mô Tả Dịch Vụ',
    content: `Vietlott Dashboard cung cấp:

• **Thống kê dữ liệu**: Tổng hợp và trực quan hóa kết quả xổ số Vietlott (Mega 6/45, Power 6/55) từ nguồn công khai.
• **Phân tích tần suất**: Biểu đồ tần suất xuất hiện, cặp số phổ biến, số lâu chưa về, phân bổ chẵn/lẻ.
• **Công cụ dự đoán**: Sinh bộ số ngẫu nhiên dựa trên thuật toán CSPRNG kết hợp phân tích dữ liệu lịch sử.
• **Nội dung phân tích**: Bài viết nhận định xu hướng được cập nhật theo kỳ quay thưởng.

Dịch vụ hoạt động hoàn toàn trên nền web, không yêu cầu tải xuống hoặc cài đặt phần mềm.`,
  },
  {
    icon: AlertTriangle,
    color: 'amber',
    title: '3. Miễn Trừ Trách Nhiệm Về Xổ Số',
    content: `**ĐÂY LÀ ĐIỀU KHOẢN QUAN TRỌNG NHẤT:**

• Xổ số tự chọn Vietlott là trò chơi có thưởng mang tính **may rủi cao**. Kết quả mỗi kỳ quay thưởng là hoàn toàn ngẫu nhiên và độc lập.
• Mọi phân tích thống kê, biểu đồ, và bộ số gợi ý trên trang web chỉ mang tính chất **tham khảo giải trí**, KHÔNG phải lời khuyên tài chính hay cam kết trúng thưởng.
• **Không có bất kỳ thuật toán, phần mềm, hay hệ thống nào** có thể dự đoán chính xác hoặc đảm bảo chiến thắng xổ số.
• Vietlott Dashboard **KHÔNG CHỊU TRÁCH NHIỆM** cho bất kỳ tổn thất tài chính nào phát sinh từ việc mua vé xổ số dựa trên thông tin trên trang web.
• Người dùng phải từ **18 tuổi trở lên** và tự chịu trách nhiệm cho mọi quyết định tham gia xổ số.
• Hãy luôn chơi có trách nhiệm và trong giới hạn tài chính cho phép.`,
  },
  {
    icon: Ban,
    color: 'red',
    title: '4. Hành Vi Bị Cấm',
    content: `Khi sử dụng Dịch vụ, bạn cam kết KHÔNG:

• Sử dụng bot, scraper, hoặc công cụ tự động để truy cập hàng loạt vượt quá mức sử dụng thông thường.
• Cố gắng truy cập trái phép vào hệ thống, cơ sở dữ liệu, hoặc máy chủ.
• Sao chép, phân phối lại nội dung phân tích hoặc giao diện người dùng mà không có sự cho phép bằng văn bản.
• Sử dụng Dịch vụ cho mục đích quảng cáo lừa đảo ("chắc chắn trúng", "bán số đề") hoặc bất hợp pháp.
• Can thiệp vào hoạt động bình thường của trang web hoặc gây ảnh hưởng tiêu cực đến người dùng khác.`,
  },
  {
    icon: FileText,
    color: 'teal',
    title: '5. Sở Hữu Trí Tuệ',
    content: `• Toàn bộ mã nguồn, thiết kế giao diện, thuật toán, và nội dung phân tích trên Vietlott Dashboard là tài sản trí tuệ của chúng tôi hoặc các bên cấp phép.
• Dữ liệu kết quả xổ số là thông tin công khai do Vietlott công bố và không thuộc quyền sở hữu của chúng tôi.
• Bạn được phép sử dụng Dịch vụ cho mục đích cá nhân, phi thương mại.
• Việc sao chép, sửa đổi, hoặc phân phối lại bất kỳ phần nào của Dịch vụ mà không có sự cho phép bằng văn bản là bị nghiêm cấm.`,
  },
  {
    icon: Gavel,
    color: 'indigo',
    title: '6. Luật Áp Dụng & Giải Quyết Tranh Chấp',
    content: `• Các điều khoản này được điều chỉnh bởi pháp luật Việt Nam.
• Mọi tranh chấp phát sinh sẽ được giải quyết thông qua thương lượng thiện chí trước tiên. Nếu không đạt được thỏa thuận, tranh chấp sẽ được đưa ra Tòa án nhân dân có thẩm quyền tại Việt Nam.
• Chúng tôi bảo lưu quyền cập nhật các điều khoản này bất kỳ lúc nào. Phiên bản mới nhất luôn có sẵn tại trang này.

**Liên hệ**: dangochinh.work@gmail.com`,
  },
];

const colorMap = {
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  red: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
  teal: { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/20' },
  indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' },
};

export default function TermsPage() {
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
            <FileText className="w-5 h-5 text-blue-400" />
            <h1 className="text-lg font-bold">Điều Khoản Sử Dụng</h1>
          </div>
          <div className="w-20" />
        </div>
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-10">
          <p className="text-sm text-gray-500 mb-2">Cập nhật lần cuối: Tháng 5, 2026</p>
          <p className="text-gray-400 leading-relaxed">
            Vui lòng đọc kỹ các điều khoản và điều kiện dưới đây trước khi sử dụng dịch vụ{' '}
            <strong className="text-white">Vietlott Dashboard</strong>.
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
                <div className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">
                  {section.content.split('\n').map((line, i) => (
                    <p key={i} className="mb-1" dangerouslySetInnerHTML={{
                      __html: line
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-200">$1</strong>')
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
