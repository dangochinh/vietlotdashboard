import Link from 'next/link';
import { BarChart3, Info, Layers3, Sparkles } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, lastUpdated, onInfoOpen }) {
  return (
    <header className="sticky top-0 z-50 -mx-4 border-b border-white/10 bg-[#0b1525]/95 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 text-base font-black tracking-[0.13em] text-white sm:text-lg">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-400 text-[#08111f]"><Layers3 className="h-5 w-5" /></span>
          VIETLOTT<span className="text-teal-400">STUDIO</span>
        </Link>
        <nav className="flex items-center gap-1.5 sm:gap-2" aria-label="Điều hướng chính">
          <span aria-current="page" className="hidden items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-white md:inline-flex"><BarChart3 className="h-4 w-4" /> Thống kê</span>
          <button type="button" onClick={onInfoOpen} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-teal-400"><Info className="h-4 w-4" /><span className="hidden sm:inline">Giới thiệu</span></button>
          <Link href="/predict" className="inline-flex items-center gap-2 rounded-xl bg-teal-400 px-3 py-2 text-sm font-black text-[#08111f] transition-colors hover:bg-teal-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-4"><Sparkles className="h-4 w-4" /> Tạo Bộ Vé</Link>
        </nav>
      </div>
      <div className="mx-auto mt-3 flex max-w-7xl flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-3">
        <div className="flex rounded-xl border border-white/10 bg-[#071321] p-1" role="group" aria-label="Chọn loại hình xổ số">
          <button type="button" aria-pressed={activeTab === 'Mega645'} onClick={() => setActiveTab('Mega645')} className={'rounded-lg px-3 py-2 text-xs font-bold transition-colors sm:px-5 sm:text-sm ' + (activeTab === 'Mega645' ? 'bg-teal-400 text-slate-950' : 'text-slate-400 hover:text-white')}>Mega 6/45</button>
          <button type="button" aria-pressed={activeTab === 'Power655'} onClick={() => setActiveTab('Power655')} className={'rounded-lg px-3 py-2 text-xs font-bold transition-colors sm:px-5 sm:text-sm ' + (activeTab === 'Power655' ? 'bg-teal-400 text-slate-950' : 'text-slate-400 hover:text-white')}>Power 6/55</button>
        </div>
        <p className="text-[11px] leading-4 text-slate-400 sm:text-xs">{lastUpdated ? 'Dữ liệu cập nhật: ' + lastUpdated : 'Lịch sử quay số · Phân tích thống kê'}</p>
      </div>
    </header>
  );
}
