import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';
import { CHART_COLORS, EXPECTED_SUM } from '../lib/constants';

export default function SumScatter({ data, activeTab }) {
    if (!data?.length) return null;

    return (
        <div className="bg-gray-900/40 rounded-3xl p-6 border border-gray-800 shadow-xl flex flex-col w-full">
            <div className="flex items-center mb-2 gap-2 text-gray-300 font-semibold">
                <Activity className="w-5 h-5 text-fuchsia-400" />
                <h3>Phân Tán Tổng Điểm 6 Số (100 Kỳ Gần Nhất)</h3>
            </div>
            <p className="text-xs text-gray-500 mb-6 font-medium">
                Trung bình kỳ vọng Mega 6/45: {EXPECTED_SUM.Mega645}, Power 6/55: {EXPECTED_SUM.Power655}
            </p>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: -10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis type="number" dataKey="index" name="Kỳ" stroke="#888" tick={false} axisLine={false} label={{ value: '100 kỳ quay lại đây', position: 'insideBottom', offset: -10, fill: '#666' }} />
                        <YAxis type="number" dataKey="sum" name="Tổng Điểm" stroke="#888" axisLine={false} tickLine={false} />
                        <ZAxis type="number" range={[40, 40]} />
                        <Tooltip
                            cursor={{ strokeDasharray: '3 3' }}
                            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '12px' }}
                            formatter={(value, name) => [value, name === 'sum' ? 'Tổng 6 số' : 'Kỳ']}
                            labelFormatter={(label, payload) => payload?.[0]?.payload?.drawId}
                        />
                        <Scatter name="Tổng" data={data} fill={CHART_COLORS.scatter} opacity={0.7} />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
