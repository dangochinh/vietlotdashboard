import { ArrowUpRight, Timer, Trophy } from 'lucide-react';
import Link from 'next/link';

export default function JackpotCard({ activeTab, jackpotData, countdown }) {
  if (!jackpotData) return null;
  return (
    <section className="relative isolate overflow-hidden rounded-[28px] border border-teal-400/20 bg-gradient-to-br from-[#173a44] via-[#142b38] to-[#111d30] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.2)] md:p-9">
      <div className="pointer-events-none absolute -right-16 -top-28 -z-10 h-80 w-80 rounded-full bg-teal-400/15 blur-[90px]" />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-teal-200"><Trophy className="h-4 w-4" /> Giá trị jackpot ước tính</p>
          {activeTab === 'Mega645' ? (
            <p className="break-words text-3xl font-black tracking-tight text-white sm:text-5xl">{jackpotData.jackpot1} <span className="text-lg text-teal-200 sm:text-2xl">VNĐ</span></p>
          ) : (
            <div className="space-y-2">
              <p className="break-words text-2xl font-black text-white sm:text-4xl">JP1: {jackpotData.jackpot1} <span className="text-lg text-teal-200">VNĐ</span></p>
              {jackpotData.jackpot2 && <p className="break-words text-xl font-bold text-amber-300 sm:text-2xl">JP2: {jackpotData.jackpot2} VNĐ</p>}
            </div>
          )}
          <p className="mt-4 max-w-xl text-xs leading-5 text-slate-300">Số liệu chỉ để tham khảo. Kiểm tra kết quả và thông tin chính thức trước khi tham gia.</p>
        </div>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-stretch">
          <div className="rounded-xl border border-white/15 bg-[#071523]/60 px-4 py-3">
            <span className="mb-1 flex items-center gap-2 text-xs text-slate-300"><Timer className="h-4 w-4 text-amber-300" /> Đếm ngược kỳ tiếp theo</span>
            <span className="font-mono text-xl font-black tabular-nums text-amber-200">{countdown}</span>
          </div>
          <Link href="/predict" className="flex items-center justify-center gap-2 rounded-xl bg-teal-400 px-5 py-3.5 text-sm font-black text-slate-950 transition-colors hover:bg-teal-300">Tạo bộ vé <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </section>
  );
}
