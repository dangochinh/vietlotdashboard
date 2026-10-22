"use client";

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, Check, Copy, Info, Layers3, RefreshCcw,
  Send, ShieldCheck, Shuffle, Sparkles, Trash2, WandSparkles
} from 'lucide-react';
import { generateTicketSet, normalizeSeeds, summarizeTickets, GAMES } from '../lib/ticketEngine.mjs';

const EMPTY = [[], [], [], [], []];
const LABELS = ['A', 'B', 'C', 'D', 'E'];

export default function PredictPage() {
  const [game, setGame] = useState('Mega645');
  const [favoriteInput, setFavoriteInput] = useState('');
  const [mode, setMode] = useState('coverage');
  const [tickets, setTickets] = useState(EMPTY);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const max = GAMES[game];
  const parsed = normalizeSeeds(favoriteInput, game);
  const summary = summarizeTickets(tickets, game);
  const grid = Array.from({ length: max }, (_, i) => String(i + 1).padStart(2, '0'));

  function switchGame(nextGame) {
    if (nextGame === game) return;
    setGame(nextGame);
    setFavoriteInput('');
    setTickets([[], [], [], [], []]);
    setActiveIndex(0);
    setError('');
    setCopied(false);
  }

  function changeFavorites(raw) {
    const digits = raw.replace(/\D/g, '').slice(0, 6);
    const formatted = digits.match(/.{1,2}/g)?.join(' ') || '';
    setFavoriteInput(formatted);
    setTickets([[], [], [], [], []]);
    setError('');
    setCopied(false);
  }

  function toggleFavorite(num) {
    const { seeds, error: validationError } = normalizeSeeds(favoriteInput, game);
    if (validationError) {
      setError(validationError);
      return;
    }
    const next = seeds.includes(num) ? seeds.filter(n => n !== num) : [...seeds, num];
    if (next.length > 3) {
      setError('Chỉ được chọn tối đa 3 số yêu thích');
      return;
    }
    setFavoriteInput(next.join(' '));
    setTickets([[], [], [], [], []]);
    setError('');
    setCopied(false);
  }

  function generateAll() {
    const { seeds, error: validationError } = normalizeSeeds(favoriteInput, game);
    if (validationError) { setError(validationError); return; }
    try {
      const result = generateTicketSet({ game, seeds, count: 5, mode });
      setTickets(result);
      setActiveIndex(0);
      setError('');
      setCopied(false);
    } catch (err) {
      setError(err.message || 'Không thể tạo bộ vé');
    }
  }

  function regenerateOne(index) {
    const { seeds, error: validationError } = normalizeSeeds(favoriteInput, game);
    if (validationError) { setError(validationError); return; }
    try {
      const others = tickets.filter((ticket, i) => i !== index && ticket.length === 6);
      const [newTicket] = generateTicketSet({ game, seeds, count: 1, mode, existing: others });
      setTickets(prev => prev.map((ticket, i) => i === index ? newTicket : ticket));
      setActiveIndex(index);
      setError('');
      setCopied(false);
    } catch (err) {
      setError(err.message || 'Không thể tạo lại vé');
    }
  }

  function clearTicket(index) {
    setTickets(prev => prev.map((ticket, i) => i === index ? [] : ticket));
    setCopied(false);
  }

  function toggleTicketNumber(num) {
    setTickets(prev => prev.map((ticket, i) => {
      if (i !== activeIndex) return ticket;
      if (ticket.includes(num)) return ticket.filter(n => n !== num);
      if (ticket.length >= 6) return ticket;
      return [...ticket, num].sort((a, b) => +a - +b);
    }));
    setCopied(false);
  }

  function formattedTickets() {
    return tickets
      .map((ticket, index) => ticket.length === 6 ? LABELS[index] + ': ' + ticket.join(' - ') : null)
      .filter(Boolean).join('\n');
  }

  async function copyTickets() {
    const text = formattedTickets();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setError('Trình duyệt không cho phép sao chép. Vui lòng kiểm tra quyền Clipboard.');
    }
  }

  function openSMS() {
    const valid = tickets.filter(ticket => ticket.length === 6);
    if (!valid.length) return;
    const code = game === 'Mega645' ? '645' : '655';
    const body = code + ' K1 ' + valid.map(ticket => 'S ' + ticket.join(' ')).join(' ');
    window.location.href = 'sms:9969?body=' + encodeURIComponent(body);
  }

  return (
    <div className="min-h-screen bg-[#08111f] text-slate-50">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b1525]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="group inline-flex items-center gap-2 rounded-lg text-sm text-slate-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-400" aria-label="Quay lại trang thống kê">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="hidden sm:inline">Thống kê</span>
            <span className="sm:hidden">Trở về</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-sm font-black tracking-[0.16em] sm:text-base">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-400 text-[#071423]"><Layers3 className="h-5 w-5" /></span>
            VIETLOTT<span className="text-teal-400">STUDIO</span>
          </Link>
          <span className="hidden rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300 sm:inline-flex">Công cụ tham khảo độc lập</span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:pt-12">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-teal-400/25 bg-teal-400/10 px-3 py-1 text-xs font-semibold tracking-wide text-teal-300">
              <Sparkles className="h-3.5 w-3.5" /> TICKET LAB
            </div>
            <h1 className="max-w-3xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">Tạo bộ vé <span className="text-teal-400">theo cách của bạn.</span></h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Chọn số yêu thích, chọn cách phân bổ và tạo 5 bộ số trong một lần. Có thể điều chỉnh từng vé sau khi tạo.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-1.5" role="group" aria-label="Chọn loại hình xổ số">
            <button type="button" onClick={() => switchGame('Mega645')} aria-pressed={game === 'Mega645'} className={'min-w-28 rounded-xl px-5 py-3 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-teal-400 ' + (game === 'Mega645' ? 'bg-teal-400 text-slate-950' : 'text-slate-400 hover:bg-white/10 hover:text-white')}>6/45</button>
            <button type="button" onClick={() => switchGame('Power655')} aria-pressed={game === 'Power655'} className={'min-w-28 rounded-xl px-5 py-3 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-teal-400 ' + (game === 'Power655' ? 'bg-teal-400 text-slate-950' : 'text-slate-400 hover:bg-white/10 hover:text-white')}>6/55</button>
          </div>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(310px,380px)_minmax(0,1fr)] lg:gap-6">
          <aside className="space-y-5">
            <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#111f33] shadow-[0_20px_50px_rgba(0,0,0,0.17)]">
              <div className="border-b border-white/10 px-5 py-5 sm:px-6">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-teal-300"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-400 text-xs text-slate-950">1</span> Thiết lập</div>
                <h2 className="text-xl font-bold">Cấu hình bộ số</h2>
                <p className="mt-1 text-sm text-slate-400">Tùy chỉnh trước khi sinh vé.</p>
              </div>
              <div className="space-y-6 p-5 sm:p-6">
                <div>
                  <label htmlFor="favorite-numbers" className="mb-2 block text-sm font-semibold text-slate-100">Số yêu thích <span className="font-normal text-slate-400">(không bắt buộc)</span></label>
                  <input id="favorite-numbers" type="text" inputMode="numeric" autoComplete="off" placeholder="Nhập hạt giống (VD: 08 12)" value={favoriteInput} onChange={e => changeFavorites(e.target.value)} onKeyDown={e => e.key === 'Enter' && generateAll()} aria-invalid={Boolean(parsed.error)} className="w-full rounded-xl border border-white/15 bg-[#0a1525] px-4 py-3.5 font-mono text-base tracking-wider text-white outline-none transition-colors placeholder:font-sans placeholder:text-sm placeholder:tracking-normal placeholder:text-slate-500 focus:border-teal-400" />
                  <p className="mt-2 text-xs leading-5 text-slate-400">Tối đa 3 số. Các số này sẽ xuất hiện trong mọi vé được tạo.</p>
                  <div className="mt-3 grid grid-cols-7 gap-1.5" role="group" aria-label="Chọn số yêu thích">
                    {grid.map(num => {
                      const chosen = parsed.seeds.includes(num);
                      return (
                        <button key={num} type="button" onClick={() => toggleFavorite(num)} aria-pressed={chosen} aria-label={'Yêu thích số ' + num} className={'aspect-square min-w-0 rounded-lg border text-[11px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-teal-300 sm:text-xs ' + (chosen ? 'border-teal-300 bg-teal-400 text-slate-950' : 'border-white/10 bg-white/[0.05] text-slate-300 hover:border-teal-400/50 hover:bg-teal-400/10')}>{num}</button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <h3 className="mb-3 text-sm font-semibold">Chiến lược phân bổ</h3>
                  <div className="grid grid-cols-2 gap-2" role="group" aria-label="Chiến lược tạo vé">
                    <button type="button" onClick={() => setMode('coverage')} aria-pressed={mode === 'coverage'} className={'rounded-2xl border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-teal-400 ' + (mode === 'coverage' ? 'border-teal-400/70 bg-teal-400/10' : 'border-white/10 bg-[#0a1525] hover:border-white/30')}>
                      <Layers3 className={'mb-2 h-5 w-5 ' + (mode === 'coverage' ? 'text-teal-300' : 'text-slate-400')} />
                      <span className="block text-sm font-bold">Phủ số</span><span className="mt-1 block text-[11px] leading-4 text-slate-400">Giảm số lặp giữa các vé</span>
                    </button>
                    <button type="button" onClick={() => setMode('random')} aria-pressed={mode === 'random'} className={'rounded-2xl border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-teal-400 ' + (mode === 'random' ? 'border-teal-400/70 bg-teal-400/10' : 'border-white/10 bg-[#0a1525] hover:border-white/30')}>
                      <Shuffle className={'mb-2 h-5 w-5 ' + (mode === 'random' ? 'text-teal-300' : 'text-slate-400')} />
                      <span className="block text-sm font-bold">Ngẫu nhiên</span><span className="mt-1 block text-[11px] leading-4 text-slate-400">Chọn số độc lập mỗi vé</span>
                    </button>
                  </div>
                </div>
                <button type="button" onClick={generateAll} className="group flex w-full items-center justify-center gap-2 rounded-xl bg-teal-400 px-5 py-4 text-sm font-black text-slate-950 shadow-lg shadow-teal-950/20 transition-all hover:bg-teal-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                  <WandSparkles className="h-5 w-5" /> Tạo 5 Vé <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                {error && <p role="alert" className="rounded-xl border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-200">{error}</p>}
              </div>
            </section>

            <div className="rounded-2xl border border-sky-300/15 bg-sky-300/[0.06] p-4 text-xs leading-5 text-slate-300">
              <p className="mb-1 flex items-center gap-2 font-bold text-sky-200"><ShieldCheck className="h-4 w-4" /> Về xác suất</p>
              Mọi tổ hợp hợp lệ đều có xác suất trúng như nhau trong một kỳ quay công bằng. Chế độ phủ số chỉ giúp phân tán lựa chọn giữa các vé, không dự đoán kết quả.
            </div>
          </aside>

          <div className="min-w-0 space-y-5">
            <section className="rounded-3xl border border-white/10 bg-[#111f33] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.17)] sm:p-6">
              <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-teal-300"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-400 text-xs text-slate-950">2</span> Kết quả</div>
                  <h2 className="text-xl font-bold sm:text-2xl">Bộ vé của bạn</h2>
                  <p className="mt-1 text-sm text-slate-400">Chọn từng vé để chỉnh sửa hoặc tạo lại.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#0a1525] px-4 py-3 text-right">
                  <span className="block text-2xl font-black tabular-nums text-teal-300">{summary.count}<span className="text-base text-slate-500">/5</span></span>
                  <span className="text-xs text-slate-400">vé hoàn chỉnh</span>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2" data-testid="ticket-list">
                {tickets.map((ticket, index) => (
                  <div key={index} data-testid={'ticket-' + index} className={'min-w-0 rounded-2xl border p-3.5 transition-colors sm:p-4 ' + (activeIndex === index ? 'border-teal-400/60 bg-teal-400/[0.07]' : 'border-white/10 bg-[#0b182a] hover:border-white/25')}>
                    <div className="mb-4 flex items-center justify-between gap-2">
                      <button type="button" onClick={() => setActiveIndex(index)} aria-pressed={activeIndex === index} className="flex items-center gap-2 rounded-lg text-left text-sm font-bold focus-visible:outline-2 focus-visible:outline-teal-400">
                        <span className={'flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black ' + (activeIndex === index ? 'bg-teal-400 text-slate-950' : 'bg-white/10 text-slate-300')}>{LABELS[index]}</span>
                        Vé {LABELS[index]}
                      </button>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => regenerateOne(index)} title={'Tạo lại vé ' + LABELS[index]} aria-label={'Tạo lại vé ' + LABELS[index]} className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-teal-300 focus-visible:outline-2 focus-visible:outline-teal-400"><RefreshCcw className="h-4 w-4" /></button>
                        <button type="button" onClick={() => clearTicket(index)} title={'Xóa vé ' + LABELS[index]} aria-label={'Xóa vé ' + LABELS[index]} className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-rose-300 focus-visible:outline-2 focus-visible:outline-teal-400"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                    <div className="grid grid-cols-6 gap-1.5">
                      {Array.from({ length: 6 }, (_, i) => {
                        const num = ticket[i];
                        const favorite = num && parsed.seeds.includes(num);
                        return <span key={i} className={'flex aspect-square min-w-0 items-center justify-center rounded-full border font-mono text-xs font-black tabular-nums sm:text-sm ' + (num ? (favorite ? 'border-amber-300/80 bg-amber-300 text-[#162133]' : 'border-teal-400/40 bg-[#173a44] text-teal-200') : 'border-dashed border-white/15 bg-white/[0.03] text-slate-600')} aria-label={num ? 'Số ' + num : 'Ô trống'}>{num || '·'}</span>;
                      })}
                    </div>
                    <button type="button" onClick={() => setActiveIndex(index)} className={'mt-3 w-full rounded-lg px-2 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-teal-400 ' + (activeIndex === index ? 'bg-teal-400/15 text-teal-300' : 'bg-white/[0.04] text-slate-400 hover:text-white')}>{activeIndex === index ? 'Đang chỉnh sửa' : 'Chọn để chỉnh sửa'}</button>
                  </div>
                ))}
              </div>
              <div className="mt-5 border-t border-white/10 pt-5">
                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                  <span className="font-bold">Độ phủ của bộ vé</span>
                  <span className="font-mono font-semibold text-teal-300">{summary.distinct}/{summary.maximum} số · {summary.ratio}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-300 transition-[width]" style={{ width: summary.ratio + '%' }} />
                </div>
                <p className="mt-2 text-xs text-slate-400">Số khác nhau trên tất cả vé hoàn chỉnh; không phải tỷ lệ trúng thưởng.</p>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-[#111f33] p-5 sm:p-6">
              <div className="mb-5 flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-teal-300"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-400 text-xs text-slate-950">3</span> Chỉnh sửa thủ công</div>
                  <h2 className="text-xl font-bold">Bảng chọn số · Vé {LABELS[activeIndex]}</h2>
                  <p className="mt-1 text-sm text-slate-400">Chạm số đang chọn để bỏ, sau đó chọn số khác.</p>
                </div>
                <span className="rounded-lg bg-white/10 px-3 py-2 font-mono text-sm font-bold text-teal-300">{tickets[activeIndex].length}/6</span>
              </div>
              <div className="grid grid-cols-7 gap-2 sm:grid-cols-10" role="group" aria-label={'Bảng chọn số vé ' + LABELS[activeIndex]}>
                {grid.map(num => {
                  const isSelected = tickets[activeIndex].includes(num);
                  return (
                    <button type="button" key={num} aria-pressed={isSelected} aria-label={'Chọn số ' + num} disabled={!isSelected && tickets[activeIndex].length >= 6} onClick={() => toggleTicketNumber(num)} className={'aspect-square min-w-0 rounded-xl border font-mono text-xs font-black transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:text-sm ' + (isSelected ? 'border-teal-300 bg-teal-400 text-slate-950' : 'border-white/10 bg-[#0a1525] text-slate-300 hover:border-teal-300/50 hover:bg-teal-400/10 disabled:cursor-not-allowed disabled:opacity-35')}>{num}</button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-[#111f33] p-5 sm:p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold"><Check className="h-5 w-5 text-teal-300" /> Xuất bộ vé</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={copyTickets} disabled={!summary.count} className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3.5 text-sm font-bold transition-colors hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? 'Đã sao chép' : 'Sao chép bộ vé'}
                </button>
                <button type="button" onClick={openSMS} disabled={!summary.count} className="flex items-center justify-center gap-2 rounded-xl border border-teal-400/50 bg-teal-400/10 px-4 py-3.5 text-sm font-bold text-teal-300 transition-colors hover:bg-teal-400/20 disabled:cursor-not-allowed disabled:opacity-40"><Send className="h-4 w-4" /> Soạn SMS</button>
              </div>
              <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-slate-400"><Info className="mt-0.5 h-4 w-4 shrink-0" /> Chỉ mở ứng dụng tin nhắn, không tự gửi hoặc mua vé. Vui lòng kiểm tra cú pháp, đầu số và giá trước khi gửi.</p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
