export default function HistoryTable({ data, activeTab }) {
    if (!data?.length) return null;

    return (
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
                                            );
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
    );
}
