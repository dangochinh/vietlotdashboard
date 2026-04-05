import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity } from 'lucide-react';
import { TOOLTIP_STYLE } from '../lib/constants';

export default function FullFrequencyChart({ data }) {
    if (!data?.sequential?.length) return null;

    // Find the threshold for highlighting (e.g., top 5 values)
    const sortedVals = [...data.sequential].map(d => d.frequency).sort((a, b) => b - a);
    const threshold = sortedVals[4] || 0; // highlighting top 5 (which might be more if tied)

    return (
        <div className="bg-gray-900/40 rounded-3xl p-6 border border-gray-800 shadow-xl flex flex-col mt-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-100 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-orange-500" />
                        Phân Tích Tần Suất Toàn Diện
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">Biểu đồ thể hiện tần suất xuất hiện của tất cả các số theo thứ tự</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                    <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider">Tần suất cao</span>
                </div>
            </div>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.sequential} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                        <XAxis dataKey="name" stroke="#888" tickLine={false} axisLine={false} interval={0} tick={{ fontSize: 10 }} />
                        <YAxis stroke="#888" tickLine={false} axisLine={false} />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            {...TOOLTIP_STYLE}
                            itemStyle={{ color: '#f97316' }}
                        />
                        <Bar dataKey="frequency" name="Số lần" radius={[4, 4, 0, 0]}>
                            {data.sequential.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.frequency >= threshold ? '#ea580c' : '#334155'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
