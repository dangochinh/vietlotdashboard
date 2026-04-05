import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, Maximize2, X } from 'lucide-react';
import { TOOLTIP_STYLE } from '../lib/constants';

export default function FullFrequencyChart({ data }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!data?.sequential?.length) return null;

    const sortedVals = [...data.sequential].map(d => d.frequency).sort((a, b) => b - a);
    const threshold = sortedVals[4] || 0; 

    const ChartComponent = ({ height = '100%', isModal = false }) => (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart 
                data={data.sequential} 
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis 
                    dataKey="name" 
                    stroke="#888" 
                    tickLine={false} 
                    axisLine={false} 
                    interval={0} 
                    tick={{ fontSize: isModal ? 12 : 10 }}
                    height={30}
                />
                <YAxis stroke="#888" tickLine={false} axisLine={false} />
                <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    {...TOOLTIP_STYLE}
                    itemStyle={{ color: '#f97316' }}
                />
                <Bar 
                    dataKey="frequency" 
                    name="Số lần" 
                    radius={[4, 4, 0, 0]}
                    isAnimationActive={false} // Disable animation to prevent "jumping" effect on load/tab switch
                >
                    {data.sequential.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.frequency >= threshold ? '#ea580c' : '#334155'} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );

    return (
        <div className="bg-gray-900/40 rounded-3xl p-4 md:p-6 border border-gray-800 shadow-xl flex flex-col mt-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-100 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-orange-500" />
                        Phân Tích Tần Suất Toàn Diện
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">Biểu đồ thể hiện tần suất xuất hiện của tất cả các số</p>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                    <div className="hidden md:flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                        <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Top 5</span>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-all border border-gray-700 shadow-lg"
                        title="Mở toàn màn hình"
                    >
                        <Maximize2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Inline Chart Container with Horizontal Scroll */}
            <div className="w-full overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                <div className="h-80" style={{ minWidth: Math.max(0, data.sequential.length * 20) + 'px' }}>
                    <ChartComponent />
                </div>
            </div>

            {/* legend for mobile */}
            <div className="flex md:hidden items-center gap-2 mt-2">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Tần suất cao nhất (Top 5)</span>
            </div>

            {/* Fullscreen Modal with Landscape Rotation Feature */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[9999] bg-[#0E1217] flex flex-col animate-in fade-in duration-300">
                    {/* Rotate container for mobile portrait */}
                    <div className="flex-1 flex flex-col p-4 md:p-8 md:rotate-0 h-full w-full max-sm:portrait:rotate-90 max-sm:portrait:w-[100vh] max-sm:portrait:h-[100vw] max-sm:portrait:fixed max-sm:portrait:top-1/2 max-sm:portrait:left-1/2 max-sm:portrait:-translate-x-1/2 max-sm:portrait:-translate-y-1/2 max-sm:portrait:origin-center bg-[#0E1217]">
                        
                        <div className="flex items-center justify-between mb-6 md:mb-8">
                            <div className="flex items-center gap-3">
                                <Activity className="w-6 h-6 text-orange-500" />
                                <div>
                                    <h2 className="text-lg md:text-2xl font-bold text-white">Toàn bộ Tần suất Số</h2>
                                    <p className="text-gray-400 text-xs md:text-sm">Xem chi tiết các số từ 01 đến {data.sequential.length}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 md:p-3 bg-gray-800 hover:bg-red-900/40 text-gray-300 hover:text-red-400 rounded-2xl transition-all border border-gray-700"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-x-auto overflow-y-hidden pb-8 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900/20 px-2">
                            <div className="h-full" style={{ minWidth: Math.max(1000, data.sequential.length * (isModalOpen ? 30 : 28)) + 'px' }}>
                                <ChartComponent height="100%" isModal={true} />
                            </div>
                        </div>
                        
                        <div className="mt-4 text-center text-gray-500 text-[10px] md:text-sm font-medium">
                             &larr; Vuốt sang ngang để xem thêm &rarr; {isModalOpen && <span className="hidden max-sm:portrait:inline ml-2">(Chế độ màn hình ngang tối ưu)</span>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
