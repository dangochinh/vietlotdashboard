import { X, Info, Rocket, Heart, Code2 } from 'lucide-react';

export default function InfoModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-xl relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <div className="p-5 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-gray-900 z-10 rounded-t-2xl">
                    <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2">
                        <Code2 className="w-5 h-5 text-teal-400" />
                        Về Dự Án Vietlott Analytics
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-2 bg-gray-800 hover:bg-gray-700 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                    {/* Giới thiệu */}
                    <section>
                        <h3 className="text-sm font-bold text-teal-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                            <Info className="w-4 h-4" /> Giới Thiệu
                        </h3>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            Hệ thống phân tích tần suất xổ số Vietlott (Mega 6/45 &amp; Power 6/55) dựa trên toàn bộ lịch sử các kỳ quay thực tế. Dữ liệu được trích xuất (crawl) tự động hàng ngày thông qua Github Actions. Giúp bạn theo dõi số nóng, dự đoán xác suất ra của các bộ số.
                        </p>
                    </section>

                    {/* Release Notes */}
                    <section className="border-t border-gray-800 pt-5">
                        <h3 className="text-sm font-bold text-indigo-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                            <Rocket className="w-4 h-4" /> Bản Cập Nhật
                        </h3>
                        <div className="text-xs text-slate-400 space-y-2 font-mono leading-relaxed">
                            <p><span className="text-emerald-400 font-bold border border-emerald-500/30 bg-emerald-900/20 px-1 rounded">2026-02-26</span> Refactor toàn bộ kiến trúc: tách components, thêm SWR caching, cheerio parser. Thêm charts: Cold Numbers, Even/Odd Pie, Sum Scatter.</p>
                            <p><span className="text-emerald-400 font-bold border border-emerald-500/30 bg-emerald-900/20 px-1 rounded">2026-02-26</span> Thêm Thẻ hiển thị Giá Trị Jackpot Ước Tính và Bộ Đếm Ngược Kỳ Xổ Tiếp Theo.</p>
                            <p><span className="text-emerald-400 font-bold border border-emerald-500/30 bg-emerald-900/20 px-1 rounded">2026-02-25</span> Thêm Modal Xem Tất Cả (full list) kèm Progress Bar trực quan.</p>
                            <p><span className="text-emerald-400 font-bold border border-emerald-500/30 bg-emerald-900/20 px-1 rounded">2026-02-24</span> Kiến trúc crawl data tự động &amp; Sync Google Sheets hoạt động.</p>
                        </div>
                    </section>

                    {/* Donate */}
                    <section className="border-t border-gray-800 pt-5">
                        <div className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 p-4 rounded-xl border border-pink-700/50 shadow-inner">
                            <h3 className="text-base font-bold text-pink-400 mb-1 flex items-center gap-2">
                                <Heart className="w-4 h-4 fill-pink-400" /> Ủng Hộ (Donate)
                            </h3>
                            <p className="text-slate-300 text-xs mb-4">
                                Nếu tool giúp bạn tính toán nhàn hơn hoặc may mắn trúng giải, xin ly cafe nha! ❤️
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 items-center justify-start">
                                <div className="bg-white p-1.5 rounded-xl shadow-lg shrink-0 w-24 h-24 flex items-center justify-center">
                                    <img src="/donation-qr.jpg" alt="QR Code Momo" className="max-w-full max-h-full object-contain rounded-lg" />
                                </div>
                                <div className="text-sm space-y-2 text-left bg-black/40 p-3 rounded-lg border border-gray-700/50 flex-1 w-full">
                                    <p className="flex justify-between items-center"><strong className="text-pink-400">MoMo:</strong> <span className="font-mono text-white bg-gray-800 px-2 rounded">0363839007</span></p>
                                    <p className="flex justify-between items-center"><strong className="text-blue-400">Bank (ACB):</strong> <span className="font-mono text-white bg-gray-800 px-2 rounded">12342467</span></p>
                                    <div className="text-xs text-slate-400 pt-1 border-t border-gray-800">
                                        Chủ TK: Đặng Ngọc Chính<br />
                                        <span className="italic opacity-80">* Nội dung: Vietlott + Tên bạn</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
