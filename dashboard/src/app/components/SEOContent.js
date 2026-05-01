import React from 'react';
import { ShieldCheck, LineChart, Target, AlertTriangle } from 'lucide-react';

export default function SEOContent() {
  return (
    <div className="mt-16 bg-[#13181E] border border-gray-800 rounded-2xl p-6 md:p-8 text-gray-300 space-y-8">
      {/* Giới thiệu chung */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <LineChart className="w-6 h-6 text-emerald-400" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white">
            Về Vietlott Dashboard - Phân Tích & Dự Đoán Xổ Số Tự Chọn
          </h1>
        </div>
        <p className="leading-relaxed text-sm md:text-base text-gray-400">
          <strong>Vietlott Dashboard</strong> là nền tảng phân tích chuyên sâu và thống kê dữ liệu kết quả xổ số tự chọn lớn nhất, bao gồm hai sản phẩm phổ biến là <strong>Mega 6/45</strong> và <strong>Power 6/55</strong> do công ty Vietlott phát hành tại Việt Nam. Chúng tôi xây dựng hệ thống tự động thu thập kết quả ngay sau mỗi kỳ quay thưởng, từ đó áp dụng các thuật toán máy học và thống kê xác suất để trực quan hóa dữ liệu bằng các biểu đồ tương tác. Mục tiêu của chúng tôi là cung cấp cho người dùng một công cụ tra cứu mạnh mẽ, giúp người chơi xổ số hiểu rõ hơn về xu hướng của các con số thay vì chỉ lựa chọn một cách ngẫu nhiên.
        </p>
      </section>

      {/* Hướng dẫn sử dụng */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Target className="w-6 h-6 text-blue-400" />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-white">
            Giải Thích Các Chỉ Số & Biểu Đồ Thống Kê
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#1A212A] p-4 rounded-xl border border-gray-800/60">
            <h3 className="font-bold text-emerald-400 mb-2">1. Tần Suất Xuất Hiện (Frequency)</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Biểu đồ liệt kê số lần xuất hiện của từng con số trong toàn bộ lịch sử kỳ quay. Những số có tần suất cao thường được giới chuyên môn gọi là "số nóng" (Hot Numbers). Người chơi có thể sử dụng dữ liệu này để ưu tiên chọn những con số đang trong chu kỳ rơi nhiều.
            </p>
          </div>
          <div className="bg-[#1A212A] p-4 rounded-xl border border-gray-800/60">
            <h3 className="font-bold text-emerald-400 mb-2">2. Cặp Số & Bộ Ba Phổ Biến (Pairs & Trios)</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Một trong những phương pháp chọn số phổ biến là tìm các bộ số có tính liên kết. Hệ thống của chúng tôi quét hàng ngàn kỳ quay để tìm ra những cặp 2 số và bộ 3 số thường xuyên ra cùng nhau nhất, giúp bạn ghép số hiệu quả hơn.
            </p>
          </div>
          <div className="bg-[#1A212A] p-4 rounded-xl border border-gray-800/60">
            <h3 className="font-bold text-emerald-400 mb-2">3. Số Lâu Chưa Về (Cold Numbers)</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Theo định luật số lớn trong xác suất thống kê, mọi con số cuối cùng đều sẽ xuất hiện với tỉ lệ ngang nhau. Biểu đồ "Số gan" hiển thị những con số đã "vắng mặt" nhiều kỳ liên tiếp. Đầu tư vào các số lạnh đang ở ngưỡng cực đại là chiến thuật của nhiều người chơi chuyên nghiệp.
            </p>
          </div>
          <div className="bg-[#1A212A] p-4 rounded-xl border border-gray-800/60">
            <h3 className="font-bold text-emerald-400 mb-2">4. Phân Bổ Chẵn Lẻ & Tổng Số</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Phân tích cơ cấu chẵn/lẻ của một bộ số trúng thưởng. Đa số các giải Jackpot thường có tỉ lệ 3 Chẵn - 3 Lẻ hoặc 4 Chẵn - 2 Lẻ. Việc đánh giá tổng giá trị của 6 số cũng giúp bạn loại trừ những bộ số quá nhỏ hoặc quá lớn, đưa dãy số về mức trung bình vàng.
            </p>
          </div>
        </div>
      </section>

      {/* Cam kết chất lượng */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <ShieldCheck className="w-6 h-6 text-purple-400" />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-white">
            Giá Trị Nội Dung (Publisher Content)
          </h2>
        </div>
        <p className="leading-relaxed text-sm md:text-base text-gray-400">
          Nền tảng này không chỉ là một bảng hiển thị số liệu khô khan, mà là một sản phẩm phần mềm được thiết kế tối ưu hóa trải nghiệm người dùng. Chúng tôi cam kết duy trì nội dung sạch, dữ liệu minh bạch không qua chỉnh sửa, tuân thủ nghiêm ngặt các nguyên tắc chất lượng dành cho quản trị viên web (Webmaster Quality Guidelines). Mọi tính năng từ biểu đồ, tra cứu, cho đến thuật toán gợi ý đều được lập trình nhằm cung cấp tiện ích thực sự, đem lại "high-value content" cho người truy cập thường xuyên.
        </p>
      </section>

      {/* Miễn trừ trách nhiệm */}
      <section className="bg-red-500/10 border border-red-500/20 p-5 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <h3 className="text-red-400 font-bold">Miễn trừ trách nhiệm (Disclaimer)</h3>
        </div>
        <p className="text-xs md:text-sm text-red-200/80 leading-relaxed">
          Tất cả dữ liệu phân tích và gợi ý trên trang web chỉ mang tính chất tham khảo khoa học, dựa trên lịch sử kết quả. Xổ số tự chọn là một trò chơi giải trí có thưởng mang tính chất may rủi cao. Không có bất kỳ thuật toán, phần mềm hay quy luật toán học nào có thể dự đoán hay đảm bảo chiến thắng 100%. Người dùng chịu hoàn toàn trách nhiệm cho mọi quyết định mua vé của mình. Vui lòng chỉ tham gia xổ số khi đủ năng lực hành vi dân sự, từ 18 tuổi trở lên, và luôn chơi trong giới hạn tài chính cho phép.
        </p>
      </section>
    </div>
  );
}
