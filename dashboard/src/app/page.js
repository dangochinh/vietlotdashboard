"use client";
import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { Loader2, TrendingUp, Calendar, AlertCircle, Wand2, X } from 'lucide-react';

const Ball = ({ num, isSpecial }) => {
  if (!num) return null;
  const isRed = isSpecial || parseInt(num) > 40;
  return (
    <div className={`w-12 h-12 flex items-center justify-center rounded-full text-white font-bold text-lg shadow-[inset_0_-2px_4px_rgba(0,0,0,0.4),0_4px_6px_rgba(0,0,0,0.3)] 
      ${isSpecial ? 'bg-gradient-to-br from-yellow-400 to-amber-600' : isRed ? 'bg-gradient-to-br from-red-500 to-rose-700' : 'bg-gradient-to-br from-blue-500 to-indigo-700'} 
      transition-transform transform hover:scale-110 border-2 border-white/20`}
    >
      {num}
    </div>
  );
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Mega645');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // View All States
  const [viewAllModal, setViewAllModal] = useState({ open: false, title: '', type: null });

  // Prediction State
  const [predictModalOpen, setPredictModalOpen] = useState(false);
  const [inputNumber, setInputNumber] = useState('');
  const [predictedNumbers, setPredictedNumbers] = useState([]);
  const [predictError, setPredictError] = useState('');

  const handlePredict = () => {
    setPredictError('');
    setPredictedNumbers([]);

    let num = inputNumber.trim();
    if (num.length === 1) num = '0' + num;
    const maxNum = activeTab === 'Mega645' ? 45 : 55;

    if (!num || isNaN(num) || parseInt(num) < 1 || parseInt(num) > maxNum) {
      setPredictError(`Vui lòng nhập số từ 01 đến ${maxNum}`);
      return;
    }

    // Find all draws containing this number
    const relevantDraws = data.filter(row => {
      for (let i = 1; i <= 6; i++) {
        if (row[`Số ${i}`] === num) return true;
      }
      return false;
    });

    if (relevantDraws.length === 0) {
      setPredictError('Chưa có lịch sử đủ dài cho số này.');
      return;
    }

    // Count frequency of other numbers in these draws
    const counts = {};
    relevantDraws.forEach(row => {
      for (let i = 1; i <= 6; i++) {
        const val = row[`Số ${i}`];
        if (val && val !== num) {
          counts[val] = (counts[val] || 0) + 1;
        }
      }
    });

    // Sort by frequency descending
    const sorted = Object.keys(counts)
      .filter(key => counts[key] > 0)
      .sort((a, b) => counts[b] - counts[a]);

    // Pick top 5 (or less if not enough historical pairs exist)
    const topChoices = sorted.slice(0, 5);

    if (topChoices.length === 0) {
      setPredictError('Số này chưa từng xuất hiện cùng số nào khác trong lịch sử.');
      return;
    }

    setPredictedNumbers(topChoices.sort((a, b) => parseInt(a) - parseInt(b)));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/vietlott?type=${activeTab}`);
        const result = await res.json();
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error || 'Failed to fetch data');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  // Compute Frequency of Numbers
  const frequencyData = useMemo(() => {
    if (!data || data.length === 0) return [];
    const counts = {};
    const maxNum = activeTab === 'Mega645' ? 45 : 55;

    // Initialize standard numbers 1 to maxNum
    for (let i = 1; i <= maxNum; i++) {
      const strForm = i.toString().padStart(2, '0');
      counts[strForm] = 0;
    }

    data.forEach(row => {
      // Loop over columns "Số 1" to "Số 6" (and "Số Đặc Biệt" if power)
      for (let i = 1; i <= 6; i++) {
        if (row[`Số ${i}`]) counts[row[`Số ${i}`]] = (counts[row[`Số ${i}`]] || 0) + 1;
      }
      if (activeTab === 'Power655' && row['Số Đặc Biệt']) {
        counts[row['Số Đặc Biệt']] = (counts[row['Số Đặc Biệt']] || 0) + 1;
      }
    });

    const formatted = Object.keys(counts).map(key => ({
      name: key,
      tần_suất: counts[key]
    })).sort((a, b) => b.tần_suất - a.tần_suất);

    return {
      top15: formatted.slice(0, 15),
      full: formatted
    };
  }, [data, activeTab]);

  // Compute Frequency of Pairs and Trios
  const { pairData, trioData, pairDataFull, trioDataFull } = useMemo(() => {
    if (!data || data.length === 0) return { pairData: [], trioData: [], pairDataFull: [], trioDataFull: [] };

    const pairCounts = {};
    const trioCounts = {};

    data.forEach(row => {
      // Extract numbers for this drawn
      const numbers = [];
      for (let i = 1; i <= 6; i++) {
        if (row[`Số ${i}`]) numbers.push(row[`Số ${i}`]);
      }
      // Sort numbers to ensure unique pair/trio keys (e.g., "01-02" instead of "02-01")
      numbers.sort((a, b) => parseInt(a) - parseInt(b));

      const n = numbers.length;

      // Calculate Pairs
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const pairKey = `${numbers[i]} - ${numbers[j]}`;
          pairCounts[pairKey] = (pairCounts[pairKey] || 0) + 1;
        }
      }

      // Calculate Trios
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          for (let k = j + 1; k < n; k++) {
            const trioKey = `${numbers[i]} - ${numbers[j]} - ${numbers[k]}`;
            trioCounts[trioKey] = (trioCounts[trioKey] || 0) + 1;
          }
        }
      }
    });

    const sortedPairs = Object.keys(pairCounts)
      .map(key => ({ name: key, tần_suất: pairCounts[key] }))
      .sort((a, b) => b.tần_suất - a.tần_suất);

    const sortedTrios = Object.keys(trioCounts)
      .map(key => ({ name: key, tần_suất: trioCounts[key] }))
      .sort((a, b) => b.tần_suất - a.tần_suất);

    return {
      pairData: sortedPairs.slice(0, 15),
      trioData: sortedTrios.slice(0, 15),
      pairDataFull: sortedPairs,
      trioDataFull: sortedTrios
    };
  }, [data]);

  const latestDraw = data && data.length > 0 ? data[0] : null;

  return (
    <div className="min-h-screen bg-[#0E1217] text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between border-b border-gray-800 pb-4 sticky top-0 z-50 bg-[#0E1217]/95 backdrop-blur-xl pt-4 shadow-2xl rounded-b-2xl px-4 -mx-4 mb-4">
          <div>
            <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-600">
              Vietlott Analytics
            </h1>
            <p className="text-gray-400 mt-2 text-sm">Real-time statistics & drawn frequency dashboard</p>
          </div>

          <div className="mt-6 md:mt-0 flex p-1 bg-gray-900 rounded-xl border border-gray-800 shadow-inner">
            <button
              onClick={() => setActiveTab('Mega645')}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'Mega645' ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              Mega 6/45
            </button>
            <button
              onClick={() => setActiveTab('Power655')}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'Power655' ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              Power 6/55
            </button>
          </div>

          <div className="mt-4 md:mt-0">
            <button
              onClick={() => {
                setPredictModalOpen(true);
                setPredictError('');
                setPredictedNumbers([]);
                setInputNumber('');
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-indigo-500/30 border border-indigo-400/30"
            >
              <Wand2 className="w-4 h-4" />
              Dự Đoán
            </button>
          </div>
        </header>

        {/* Prediction Modal */}
        {predictModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-gray-900 border border-gray-700 p-6 rounded-2xl shadow-2xl w-full max-w-md relative animate-in zoom-in-95 duration-200">
              <button
                onClick={() => setPredictModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
                <Wand2 className="w-6 h-6 text-purple-400" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 drop-shadow-sm">Dự Đoán</span>
                <span className="px-3 py-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-[0_0_15px_rgba(147,51,234,0.4)] border border-purple-400/50 text-xl tracking-wide">
                  {activeTab === 'Mega645' ? 'Mega 6/45' : 'Power 6/55'}
                </span>
              </h2>
              <p className="text-gray-400 text-sm mb-6">Nhập 1 số bạn thích. Hệ thống sẽ phân tích lịch sử {data.length} kỳ quay để tìm ra 5 số thường xuất hiện cùng Số đó nhất.</p>

              <div className="flex gap-3 mb-4">
                <input
                  type="number"
                  value={inputNumber}
                  onChange={(e) => setInputNumber(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handlePredict()}
                  placeholder="Nhập 1 số (vd: 05)"
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-mono text-lg text-center"
                />
                <button
                  onClick={handlePredict}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg transition-colors flex items-center gap-2"
                >
                  Tìm
                </button>
              </div>

              {predictError && (
                <div className="text-red-400 text-sm mb-4 px-2 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> {predictError}
                </div>
              )}

              {predictedNumbers.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-800 animate-in fade-in slide-in-from-bottom-2">
                  <p className="text-sm text-gray-400 mb-3 font-medium">Bộ số gợi ý tốt nhất:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Ball num={inputNumber.padStart(2, '0').trim()} isSpecial={true} />
                    <div className="w-px h-10 bg-gray-700 mx-1 align-middle self-center"></div>
                    {predictedNumbers.map((num, i) => (
                      <Ball key={i} num={num} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl flex items-center gap-3 text-red-400">
            <AlertCircle />
            <span>{error}</span>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            <p className="text-xl">Chưa có dữ liệu cho {activeTab}.</p>
            <p className="text-sm mt-2">Vui lòng kiểm tra Google Sheet hoặc chạy Github Actions Scraper.</p>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Hero Section: Latest Draw */}
            <section className="bg-gray-900/50 backdrop-blur-md rounded-3xl p-8 border border-gray-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>

              <div className="flex items-center gap-3 text-emerald-400 font-semibold mb-6">
                <Calendar className="w-5 h-5" />
                <h2>Kết quả mới nhất ({latestDraw['Kỳ QSMT / Ngày']})</h2>
              </div>

              <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                <Ball num={latestDraw['Số 1']} />
                <Ball num={latestDraw['Số 2']} />
                <Ball num={latestDraw['Số 3']} />
                <Ball num={latestDraw['Số 4']} />
                <Ball num={latestDraw['Số 5']} />
                <Ball num={latestDraw['Số 6']} />
                {activeTab === 'Power655' && latestDraw['Số Đặc Biệt'] && (
                  <>
                    <div className="w-px h-12 bg-gray-700 mx-2"></div>
                    <Ball num={latestDraw['Số Đặc Biệt']} isSpecial={true} />
                  </>
                )}
              </div>
            </section>

            {/* Dashboard Grid 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Left Col: Chart 1 */}
              <div className="bg-gray-900/40 rounded-3xl p-6 border border-gray-800 shadow-xl flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 text-gray-300 font-semibold">
                    <TrendingUp className="w-5 h-5 text-teal-400" />
                    <h3>Top 15 Số Từng Xuất Hiện Nhiều Nhất</h3>
                  </div>
                  <button
                    onClick={() => setViewAllModal({ open: true, title: 'Tất Cả Tần Suất Các Số', type: 'frequency' })}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10 px-3 py-1.5 rounded-lg transition-colors border border-emerald-400/20"
                  >
                    Xem tất cả
                  </button>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={frequencyData.top15} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                      <XAxis dataKey="name" stroke="#888" tickLine={false} axisLine={false} />
                      <YAxis stroke="#888" tickLine={false} axisLine={false} />
                      <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}
                        itemStyle={{ color: '#10b981' }}
                      />
                      <Bar dataKey="tần_suất" radius={[4, 4, 0, 0]}>
                        {frequencyData.top15.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index < 3 ? '#10b981' : '#0d9488'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Right Col: History Table */}
              <div className="bg-gray-900/40 rounded-3xl p-6 border border-gray-800 shadow-xl flex flex-col h-96 mt-2 relative overflow-hidden">
                <h3 className="text-gray-300 font-semibold mb-6">Lịch Sử Mở Thưởng (100 kỳ gần nhất)</h3>
                <div className="overflow-auto flex-1 pr-2 custom-scrollbar">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase sticky top-0 bg-[#161B22] z-10">
                      <tr>
                        <th className="px-4 py-3 rounded-tl-lg rounded-bl-lg">Kỳ QSMT</th>
                        <th className="px-4 py-3">Kết quả</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((row, idx) => (
                        <tr key={idx} className="border-b border-gray-800/60 hover:bg-gray-800/40 transition-colors">
                          <td className="px-4 py-4 text-gray-300 font-medium whitespace-nowrap">{row['Kỳ QSMT / Ngày']}</td>
                          <td className="px-4 py-4">
                            <div className="flex flex-wrap gap-2">
                              {['Số 1', 'Số 2', 'Số 3', 'Số 4', 'Số 5', 'Số 6'].map(s => {
                                if (!row[s]) return null;
                                return (
                                  <span key={s} className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-800 text-xs text-gray-200 border border-gray-700">
                                    {row[s]}
                                  </span>
                                )
                              })}
                              {activeTab === 'Power655' && row['Số Đặc Biệt'] && (
                                <span className="w-7 h-7 flex items-center justify-center rounded-full bg-amber-900/50 text-xs text-amber-400 border border-amber-700/50">
                                  {row['Số Đặc Biệt']}
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Dashboard Grid 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Left Col: Chart Pairs */}
              <div className="bg-gray-900/40 rounded-3xl p-6 border border-gray-800 shadow-xl flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 text-gray-300 font-semibold">
                    <TrendingUp className="w-5 h-5 text-indigo-400" />
                    <h3>Top 15 Cặp 2 Số Hay Xuất Hiện Cùng Nhau</h3>
                  </div>
                  <button
                    onClick={() => setViewAllModal({ open: true, title: 'Tất Cả Cặp 2 Số', type: 'pairs' })}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:bg-indigo-400/10 px-3 py-1.5 rounded-lg transition-colors border border-indigo-400/20"
                  >
                    Xem tất cả
                  </button>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pairData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                      <XAxis type="number" stroke="#888" tickLine={false} axisLine={false} />
                      <YAxis dataKey="name" type="category" stroke="#888" tickLine={false} axisLine={false} width={80} />
                      <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}
                        itemStyle={{ color: '#818cf8' }}
                      />
                      <Bar dataKey="tần_suất" radius={[0, 4, 4, 0]}>
                        {pairData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index < 3 ? '#818cf8' : '#6366f1'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Right Col: Chart Trios */}
              <div className="bg-gray-900/40 rounded-3xl p-6 border border-gray-800 shadow-xl flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 text-gray-300 font-semibold">
                    <TrendingUp className="w-5 h-5 text-rose-400" />
                    <h3>Top 15 Bộ 3 Số Hay Xuất Hiện Cùng Nhau</h3>
                  </div>
                  <button
                    onClick={() => setViewAllModal({ open: true, title: 'Tất Cả Bộ 3 Số', type: 'trios' })}
                    className="text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 px-3 py-1.5 rounded-lg transition-colors border border-rose-400/20"
                  >
                    Xem tất cả
                  </button>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trioData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                      <XAxis type="number" stroke="#888" tickLine={false} axisLine={false} />
                      <YAxis dataKey="name" type="category" stroke="#888" tickLine={false} axisLine={false} width={120} />
                      <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}
                        itemStyle={{ color: '#fb7185' }}
                      />
                      <Bar dataKey="tần_suất" radius={[0, 4, 4, 0]}>
                        {trioData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index < 3 ? '#fb7185' : '#f43f5e'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* View All Modal */}
        {viewAllModal.open && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-gray-900 border border-gray-700 p-0 rounded-2xl shadow-2xl w-full max-w-2xl relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">

              <div className="p-6 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-gray-900 z-10 rounded-t-2xl">
                <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                  {viewAllModal.title}
                </h2>
                <button
                  onClick={() => setViewAllModal({ open: false, title: '', type: null })}
                  className="text-gray-400 hover:text-white transition-colors p-2 bg-gray-800 hover:bg-gray-700 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-[#161B22] rounded-lg">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg rounded-bl-lg w-1/3">
                        {viewAllModal.type === 'frequency' ? 'Số' : 'Bộ Số'}
                      </th>
                      <th className="px-4 py-3 px-8 w-2/3">Tần Suất / So Sánh</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const listData = viewAllModal.type === 'frequency' ? frequencyData.full :
                        viewAllModal.type === 'pairs' ? pairDataFull :
                          trioDataFull || [];
                      const maxFreq = listData.length > 0 ? listData[0].tần_suất : 1;

                      return listData.map((item, idx) => (
                        <tr key={idx} className="border-b border-gray-800/40 hover:bg-gray-800/40 transition-colors">
                          <td className="px-4 py-3 text-gray-300 font-medium whitespace-nowrap">
                            {viewAllModal.type === 'frequency' ? (
                              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-sm font-bold border border-gray-700">
                                {item.name}
                              </span>
                            ) : (
                              <span className="font-mono bg-gray-800 px-3 py-1 rounded-md border border-gray-700">
                                {item.name}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-emerald-400 w-10 text-right">{item.tần_suất}</span>
                              <div className="flex-1 h-2.5 bg-gray-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 rounded-full"
                                  style={{ width: `${Math.max((item.tần_suất / maxFreq) * 100, 2)}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
