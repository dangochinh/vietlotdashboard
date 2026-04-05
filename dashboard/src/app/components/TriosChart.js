import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { CHART_COLORS, TOOLTIP_STYLE } from '../lib/constants';

export default function TriosChart({ data, onViewAll }) {
    if (!data?.length) return null;

    return (
        <div className="bg-gray-900/40 rounded-3xl p-6 border border-gray-800 shadow-xl flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-gray-300 font-semibold">
                    <TrendingUp className="w-5 h-5 text-rose-400" />
                    <h3>Top 15 Bộ 3 Số Hay Xuất Hiện Cùng Nhau</h3>
                </div>
                <button
                    onClick={() => onViewAll({ open: true, title: 'Tất Cả Bộ 3 Số', type: 'trios' })}
                    className="text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 px-3 py-1.5 rounded-lg transition-colors border border-rose-400/20"
                >
                    Xem tất cả
                </button>
            </div>
            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                        <XAxis type="number" stroke="#888" tickLine={false} axisLine={false} />
                        <YAxis dataKey="name" type="category" stroke="#888" tickLine={false} axisLine={false} width={120} />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            {...TOOLTIP_STYLE}
                            itemStyle={{ color: CHART_COLORS.trios.top }}
                        />
                        <Bar dataKey="frequency" name="Số lần" radius={[0, 4, 4, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index < 3 ? CHART_COLORS.trios.top : CHART_COLORS.trios.rest} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
