import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';
import { CHART_COLORS } from '../lib/constants';

export default function EvenOddPie({ data }) {
    if (!data?.length) return null;

    return (
        <div className="bg-gray-900/40 rounded-3xl p-6 border border-gray-800 shadow-xl flex flex-col">
            <div className="flex items-center mb-6 gap-2 text-gray-300 font-semibold">
                <PieChartIcon className="w-5 h-5 text-orange-400" />
                <h3>Tỷ Lệ Chẵn Lẻ (6 Số Chính)</h3>
            </div>
            <div className="h-72 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={3}
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
                            labelLine={false}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={CHART_COLORS.evenOdd[index % CHART_COLORS.evenOdd.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '10px' }} itemStyle={{ color: '#fff' }} />
                        <Legend
                            layout="vertical"
                            verticalAlign="middle"
                            align="right"
                            wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
