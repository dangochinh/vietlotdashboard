import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { CHART_COLORS, TOOLTIP_STYLE } from '../lib/constants';

export default function PairsChart({ data, onViewAll }) {
    if (!data?.length) return null;

    return (
        <div className="bg-gray-900/40 rounded-3xl p-6 border border-gray-800 shadow-xl flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-gray-300 font-semibold">
                    <TrendingUp className="w-5 h-5 text-indigo-400" />
                    <h3>Top 15 Cặp 2 Số Hay Xuất Hiện Cùng Nhau</h3>
                </div>
                <button
                    onClick={() => onViewAll({ open: true, title: 'Tất Cả Cặp 2 Số', type: 'pairs' })}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:bg-indigo-400/10 px-3 py-1.5 rounded-lg transition-colors border border-indigo-400/20"
                >
                    Xem tất cả
                </button>
            </div>
            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                        <XAxis type="number" stroke="#888" tickLine={false} axisLine={false} />
                        <YAxis dataKey="name" type="category" stroke="#888" tickLine={false} axisLine={false} width={80} />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            {...TOOLTIP_STYLE}
                            itemStyle={{ color: CHART_COLORS.pairs.top }}
                        />
                        <Bar dataKey="frequency" name="Số lần" radius={[0, 4, 4, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index < 3 ? CHART_COLORS.pairs.top : CHART_COLORS.pairs.rest} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
