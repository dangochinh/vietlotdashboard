"use client";
import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { Loader2, TrendingUp, Calendar, AlertCircle } from 'lucide-react';

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
    })).sort((a, b) => b.tần_suất - a.tần_suất).slice(0, 15); // Top 15 frequent

    return formatted;
  }, [data, activeTab]);

  const latestDraw = data && data.length > 0 ? data[0] : null;

  return (
    <div className="min-h-screen bg-[#0E1217] text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <header className="flex flex-col md:flex-row items-center justify-between border-b border-gray-800 pb-6">
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
        </header>

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

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Left Col: Chart */}
              <div className="bg-gray-900/40 rounded-3xl p-6 border border-gray-800 shadow-xl">
                <div className="flex items-center gap-2 text-gray-300 font-semibold mb-6">
                  <TrendingUp className="w-5 h-5 text-teal-400" />
                  <h3>Top 15 Số Xuất Hiện Nhiều Nhất</h3>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={frequencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                      <XAxis dataKey="name" stroke="#888" tickLine={false} axisLine={false} />
                      <YAxis stroke="#888" tickLine={false} axisLine={false} />
                      <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}
                        itemStyle={{ color: '#10b981' }}
                      />
                      <Bar dataKey="tần_suất" radius={[4, 4, 0, 0]}>
                        {frequencyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index < 3 ? '#10b981' : '#0d9488'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Right Col: History Table */}
              <div className="bg-gray-900/40 rounded-3xl p-6 border border-gray-800 shadow-xl flex flex-col h-96">
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
          </div>
        )}
      </div>
    </div>
  );
}
