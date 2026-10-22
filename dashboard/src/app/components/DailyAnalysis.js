'use client';
import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Flame, Snowflake, BarChart3, Calendar, Lightbulb, Sparkles } from 'lucide-react';
import { MAX_NUMBERS } from '../lib/constants';

/**
 * DailyAnalysis - Auto-generated lottery insight component
 * 
 * Generates rich textual analysis from lottery data entirely client-side.
 * No API key needed. This creates the "high-value content" that AdSense requires
 * by providing unique, data-driven articles for each lottery type and draw period.
 */
export default function DailyAnalysis({ data, activeTab }) {
  const analysis = useMemo(() => {
    if (!data || data.length < 10) return null;

    const maxNum = MAX_NUMBERS[activeTab];
    const recentCount = Math.min(30, data.length);
    const recentData = data.slice(0, recentCount);
    const olderData = data.slice(recentCount, recentCount * 2);
    const lotteryName = activeTab === 'Mega645' ? 'Mega 6/45' : 'Power 6/55';
    
    // --- Frequency Analysis ---
    const freqRecent = {};
    const freqOlder = {};
    for (let i = 1; i <= maxNum; i++) {
      const key = i.toString().padStart(2, '0');
      freqRecent[key] = 0;
      freqOlder[key] = 0;
    }
    
    recentData.forEach(row => {
      for (let i = 1; i <= 6; i++) {
        const num = row[`Số ${i}`];
        if (num) freqRecent[num] = (freqRecent[num] || 0) + 1;
      }
    });
    
    olderData.forEach(row => {
      for (let i = 1; i <= 6; i++) {
        const num = row[`Số ${i}`];
        if (num) freqOlder[num] = (freqOlder[num] || 0) + 1;
      }
    });

    // Hot numbers (most frequent in recent draws)
    const hotNumbers = Object.entries(freqRecent)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([num, freq]) => ({ num, freq, trend: freq - (freqOlder[num] || 0) }));

    // Cold numbers (longest absence)
    const lastSeen = {};
    for (let i = 1; i <= maxNum; i++) lastSeen[i.toString().padStart(2, '0')] = -1;
    for (let drawIdx = 0; drawIdx < data.length; drawIdx++) {
      const row = data[drawIdx];
      for (let i = 1; i <= 6; i++) {
        const num = row[`Số ${i}`];
        if (num && lastSeen[num] === -1) lastSeen[num] = drawIdx;
      }
    }
    Object.keys(lastSeen).forEach(k => { if (lastSeen[k] === -1) lastSeen[k] = data.length; });
    
    const coldNumbers = Object.entries(lastSeen)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([num, absent]) => ({ num, absent }));

    // --- Pairs analysis ---
    const pairCounts = {};
    recentData.forEach(row => {
      const numbers = [];
      for (let i = 1; i <= 6; i++) { if (row[`Số ${i}`]) numbers.push(row[`Số ${i}`]); }
      numbers.sort((a, b) => parseInt(a) - parseInt(b));
      for (let i = 0; i < numbers.length; i++) {
        for (let j = i + 1; j < numbers.length; j++) {
          const k = `${numbers[i]}-${numbers[j]}`;
          pairCounts[k] = (pairCounts[k] || 0) + 1;
        }
      }
    });
    const topPairs = Object.entries(pairCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([pair, freq]) => ({ pair: pair.replace('-', ' - '), freq }));

    // --- Even/Odd ratio of last draw ---
    const lastDraw = data[0];
    let lastDrawNumbers = [];
    for (let i = 1; i <= 6; i++) {
      if (lastDraw[`Số ${i}`]) lastDrawNumbers.push(parseInt(lastDraw[`Số ${i}`]));
    }
    const lastEvens = lastDrawNumbers.filter(n => n % 2 === 0).length;
    const lastOdds = lastDrawNumbers.filter(n => n % 2 !== 0).length;
    const lastSum = lastDrawNumbers.reduce((a, b) => a + b, 0);

    // --- Trend detection ---
    const risingNumbers = hotNumbers.filter(h => h.trend > 0).slice(0, 3);
    const fallingNumbers = Object.entries(freqRecent)
      .map(([num, freq]) => ({ num, freq, trend: freq - (freqOlder[num] || 0) }))
      .filter(n => n.trend < 0)
      .sort((a, b) => a.trend - b.trend)
      .slice(0, 3);

    // --- Generate date ---
    const drawDate = lastDraw['Kỳ QSMT / Ngày'] || lastDraw['Kỳ QSMT'] || '';

    return {
      lotteryName,
      recentCount,
      hotNumbers,
      coldNumbers,
      topPairs,
      lastDrawNumbers: lastDrawNumbers.map(n => n.toString().padStart(2, '0')),
      lastEvens,
      lastOdds,
      lastSum,
      risingNumbers,
      fallingNumbers,
      drawDate,
      totalDraws: data.length,
    };
  }, [data, activeTab]);

  if (!analysis) return null;

  return (
    <div className="mt-8 space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl border border-amber-500/20">
          <Sparkles className="w-6 h-6 text-amber-400" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white">
            Nhận Định {analysis.lotteryName} Hôm Nay
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Phân tích tự động dựa trên {analysis.totalDraws.toLocaleString()} kỳ quay • {analysis.drawDate}
          </p>
        </div>
      </div>

      {/* Last Draw Summary */}
      <div className="bg-gradient-to-br from-[#13181E] to-[#161C24] border border-gray-800 rounded-2xl p-5 md:p-6">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-blue-400" />
          <h3 className="font-bold text-blue-400 text-sm uppercase tracking-wider">Kết Quả Kỳ Gần Nhất</h3>
        </div>
        <div className="flex gap-2 mb-4 flex-wrap">
          {analysis.lastDrawNumbers.map((num, i) => (
            <span key={i} className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/20">
              {num}
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-400 leading-relaxed">
          Kỳ quay gần nhất đã ra bộ số với cơ cấu <strong className="text-white">{analysis.lastEvens} Chẵn - {analysis.lastOdds} Lẻ</strong>,
          tổng giá trị <strong className="text-white">{analysis.lastSum}</strong>.
          {analysis.lastEvens === 3 && analysis.lastOdds === 3 
            ? ' Đây là tỉ lệ chẵn/lẻ cân bằng nhất — thường xuất hiện ở khoảng 35% tổng số kỳ quay.'
            : analysis.lastEvens > analysis.lastOdds
              ? ' Bộ số nghiêng về phía chẵn. Theo xu hướng cân bằng tự nhiên, kỳ tiếp theo có thể sẽ xuất hiện nhiều số lẻ hơn.'
              : ' Bộ số nghiêng về phía lẻ. Theo quy luật cân bằng tần suất, khả năng các số chẵn sẽ tăng trong các kỳ tới.'}
        </p>
      </div>

      {/* Hot & Cold Numbers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Hot Numbers */}
        <div className="bg-gradient-to-br from-[#13181E] to-[#1A1215] border border-red-900/20 rounded-2xl p-5 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-5 h-5 text-orange-400" />
            <h3 className="font-bold text-orange-400 text-sm uppercase tracking-wider">Số Nóng — Hot Numbers</h3>
          </div>
          <p className="text-sm text-gray-400 mb-4 leading-relaxed">
            Các số xuất hiện nhiều nhất trong <strong className="text-white">{analysis.recentCount} kỳ quay gần nhất</strong>:
          </p>
          <div className="space-y-2">
            {analysis.hotNumbers.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 font-bold text-xs border border-orange-500/30">
                  {item.num}
                </span>
                <div className="flex-1 bg-gray-800/50 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (item.freq / analysis.recentCount) * 100 * 2.5)}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-16 text-right font-mono">{item.freq} lần</span>
                {item.trend > 0 && (
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Cold Numbers */}
        <div className="bg-gradient-to-br from-[#13181E] to-[#121520] border border-blue-900/20 rounded-2xl p-5 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Snowflake className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-blue-400 text-sm uppercase tracking-wider">Số Gan — Cold Numbers</h3>
          </div>
          <p className="text-sm text-gray-400 mb-4 leading-relaxed">
            Các số <strong className="text-white">vắng mặt lâu nhất</strong>, chưa xuất hiện nhiều kỳ liên tiếp:
          </p>
          <div className="space-y-2">
            {analysis.coldNumbers.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 font-bold text-xs border border-blue-500/30">
                  {item.num}
                </span>
                <div className="flex-1 bg-gray-800/50 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (item.absent / 50) * 100)}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-20 text-right font-mono">{item.absent} kỳ vắng</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4 leading-relaxed">
            💡 Theo Định luật Số lớn (Law of Large Numbers), các số vắng mặt lâu có xác suất cân bằng tăng dần theo thời gian. 
            Tuy nhiên, mỗi kỳ quay vẫn là sự kiện độc lập.
          </p>
        </div>
      </div>

      {/* Trending & Pairs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Trending */}
        <div className="bg-gradient-to-br from-[#13181E] to-[#161C24] border border-gray-800 rounded-2xl p-5 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-emerald-400 text-sm uppercase tracking-wider">Xu Hướng Tăng/Giảm</h3>
          </div>
          <div className="space-y-4">
            {analysis.risingNumbers.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">📈 Đang tăng mạnh</p>
                <div className="flex gap-2 flex-wrap">
                  {analysis.risingNumbers.map((item, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-sm">
                      <span className="font-bold text-emerald-400">{item.num}</span>
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-xs text-emerald-500">+{item.trend}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
            {analysis.fallingNumbers.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">📉 Đang giảm</p>
                <div className="flex gap-2 flex-wrap">
                  {analysis.fallingNumbers.map((item, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-sm">
                      <span className="font-bold text-red-400">{item.num}</span>
                      <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                      <span className="text-xs text-red-500">{item.trend}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-4 leading-relaxed">
            So sánh tần suất xuất hiện giữa {analysis.recentCount} kỳ gần nhất và {analysis.recentCount} kỳ trước đó 
            để theo dõi sự thay đổi tần suất trong các kỳ đã quay. Điều này không dự báo kết quả kỳ tiếp theo.
          </p>
        </div>

        {/* Top Pairs */}
        <div className="bg-gradient-to-br from-[#13181E] to-[#161C24] border border-gray-800 rounded-2xl p-5 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-amber-400 text-sm uppercase tracking-wider">Cặp Số Nổi Bật</h3>
          </div>
          <p className="text-sm text-gray-400 mb-4 leading-relaxed">
            Top 5 cặp số cùng xuất hiện nhiều nhất trong {analysis.recentCount} kỳ gần đây:
          </p>
          <div className="space-y-2">
            {analysis.topPairs.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 px-3 bg-gray-800/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 font-mono w-5">#{i + 1}</span>
                  <span className="font-bold text-amber-300 font-mono text-sm">{item.pair}</span>
                </div>
                <span className="text-xs text-gray-500 font-mono">{item.freq} lần cùng về</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4 leading-relaxed">
            Số liệu cặp số cho thấy các lần cùng xuất hiện trong quá khứ, không chứng minh chúng có khả năng cùng xuất hiện cao hơn ở kỳ sau.
            Các mối liên hệ lịch sử chỉ mang tính mô tả.
          </p>
        </div>
      </div>

      {/* Editorial Summary */}
      <div className="bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-blue-500/5 border border-emerald-500/10 rounded-2xl p-6 md:p-8">
        <h3 className="font-bold text-white mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          Tổng Kết Phân Tích
        </h3>
        <div className="text-sm text-gray-400 leading-relaxed space-y-3">
          <p>
            Qua phân tích {analysis.totalDraws.toLocaleString()} kỳ quay thưởng {analysis.lotteryName}, 
            chúng tôi nhận thấy nhóm số nóng hiện tại tập trung ở vùng{' '}
            <strong className="text-emerald-400">
              {analysis.hotNumbers.slice(0, 3).map(h => h.num).join(', ')}
            </strong>
            {analysis.risingNumbers.length > 0 && (
              <>, trong đó{' '}
                <strong className="text-emerald-400">
                  {analysis.risingNumbers.map(r => r.num).join(', ')}
                </strong>
                {' '}đang có xu hướng tăng mạnh so với chu kỳ trước</>
            )}.
          </p>
          <p>
            Ngược lại, các số{' '}
            <strong className="text-blue-400">
              {analysis.coldNumbers.slice(0, 3).map(c => c.num).join(', ')}
            </strong>
            {' '}đã vắng mặt trên {analysis.coldNumbers[0]?.absent || 'nhiều'} kỳ liên tiếp. 
            Đây là thống kê về thời gian chưa xuất hiện, không phải dấu hiệu cho thấy một số sẽ sớm xuất hiện.
          </p>
          <p>
            Cặp số nổi bật nhất gần đây là <strong className="text-amber-400">{analysis.topPairs[0]?.pair}</strong> 
            {' '}với {analysis.topPairs[0]?.freq} lần cùng xuất hiện. 
            Người chơi có thể cân nhắc kết hợp 1-2 số nóng + 1-2 số gan + cặp số liên kết để xây dựng bộ vé đa dạng.
          </p>
          <p className="text-xs text-gray-600 italic mt-4 pt-3 border-t border-gray-800/60">
            ⚠️ Lưu ý: Tất cả phân tích trên chỉ dựa trên thống kê lịch sử. Mỗi kỳ quay thưởng là sự kiện ngẫu nhiên độc lập. 
            Không có phương pháp nào đảm bảo trúng thưởng. Hãy chơi có trách nhiệm.
          </p>
        </div>
      </div>
    </div>
  );
}
