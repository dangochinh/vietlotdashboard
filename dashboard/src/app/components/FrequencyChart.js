import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { CHART_COLORS, TOOLTIP_STYLE } from '../lib/constants';

export default function FrequencyChart({ data, onViewAll }) {
    if (!data?.top15?.length) return null;

    return (
        <div className="bg-gray-900/40 rounded-3xl p-6 border border-gray-800 shadow-xl flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-gray-300 font-semibold">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <h3>Top 15 Số Xuất Hiện Nhiều Nhất</h3>
                </div>
                <button
                    onClick={() => onViewAll({ open: true, title: 'Tất Cả Tần Suất', type: 'frequency' })}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10 px-3 py-1.5 rounded-lg transition-colors border border-emerald-400/20"
                >
                    Xem tất cả
                </button>
            </div>
            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.top15} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                        <XAxis dataKey="name" stroke="#888" tickLine={false} axisLine={false} />
                        <YAxis stroke="#888" tickLine={false} axisLine={false} />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            {...TOOLTIP_STYLE}
                            itemStyle={{ color: CHART_COLORS.frequency.top }}
                        />
                        <Bar dataKey="frequency" radius={[4, 4, 0, 0]}>
                            {data.top15.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index < 3 ? CHART_COLORS.frequency.top : CHART_COLORS.frequency.rest} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
