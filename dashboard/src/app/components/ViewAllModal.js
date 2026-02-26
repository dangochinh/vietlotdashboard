import { TrendingUp, X } from 'lucide-react';

export default function ViewAllModal({ viewAllModal, onClose, frequencyData, pairDataFull, trioDataFull, coldNumbersData }) {
    if (!viewAllModal.open) return null;

    let listData = [];
    let maxFreq = 1;

    switch (viewAllModal.type) {
        case 'frequency':
            listData = frequencyData.full;
            maxFreq = listData[0]?.frequency || 1;
            break;
        case 'pairs':
            listData = pairDataFull;
            maxFreq = listData[0]?.frequency || 1;
            break;
        case 'trios':
            listData = trioDataFull;
            maxFreq = listData[0]?.frequency || 1;
            break;
        case 'cold':
            listData = coldNumbersData.full;
            maxFreq = Math.max(...listData.map(d => d.drawsAbsent));
            if (maxFreq === 0) maxFreq = 1;
            break;
    }

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-gray-900 border border-gray-700 p-0 rounded-2xl shadow-2xl w-full max-w-2xl relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
                <div className="p-6 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-gray-900 z-10 rounded-t-2xl">
                    <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-gray-400" />
                        {viewAllModal.title}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-2 bg-gray-800 hover:bg-gray-700 rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-200 uppercase bg-slate-800/80 rounded-lg shadow-sm">
                            <tr>
                                <th className="px-4 py-3 rounded-tl-lg rounded-bl-lg w-20 font-bold tracking-wider">
                                    {viewAllModal.type === 'frequency' || viewAllModal.type === 'cold' ? 'Số' : 'Bộ Số'}
                                </th>
                                <th className="px-4 py-3 font-bold tracking-wider">
                                    {viewAllModal.type === 'cold' ? 'Số kỳ chưa về' : 'Tần Suất / So Sánh'}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {listData.map((item, idx) => (
                                <tr key={idx} className="border-b border-gray-800/40 hover:bg-gray-800/40 transition-colors">
                                    <td className="px-4 py-3 w-20 whitespace-nowrap">
                                        {viewAllModal.type === 'frequency' || viewAllModal.type === 'cold' ? (
                                            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-sm font-bold border border-gray-700 text-white shadow-sm">
                                                {item.name}
                                            </span>
                                        ) : (
                                            <span className="font-mono bg-gray-800 px-3 py-1 rounded-md border border-gray-700 text-white shadow-sm">
                                                {item.name}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-4">
                                            <span className={`font-bold w-8 text-right text-base ${viewAllModal.type === 'cold' ? 'text-blue-400' : 'text-emerald-400'}`}>
                                                {viewAllModal.type === 'cold' ? item.drawsAbsent : item.frequency}
                                            </span>
                                            <div className="flex-1 max-w-md h-3 bg-gray-800 rounded-full overflow-hidden shadow-inner">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-500 ${viewAllModal.type === 'cold'
                                                        ? 'bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]'
                                                        : (idx < 5
                                                            ? (viewAllModal.type === 'pairs' ? 'bg-gradient-to-r from-indigo-500 to-purple-400 shadow-[0_0_8px_rgba(129,140,248,0.6)]' :
                                                                viewAllModal.type === 'trios' ? 'bg-gradient-to-r from-rose-500 to-pink-400 shadow-[0_0_8px_rgba(244,63,94,0.6)]' :
                                                                    'bg-gradient-to-r from-emerald-400 to-teal-300 shadow-[0_0_8px_rgba(52,211,153,0.6)]')
                                                            : 'bg-gradient-to-r from-emerald-700/60 to-teal-600/60'
                                                        )
                                                        }`
                                                    }
                                                    style={{ width: `${Math.max(((viewAllModal.type === 'cold' ? item.drawsAbsent : item.frequency) / maxFreq) * 100, 2)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
