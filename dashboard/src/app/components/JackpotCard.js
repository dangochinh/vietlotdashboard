import { Timer } from 'lucide-react';

export default function JackpotCard({ activeTab, jackpotData, countdown }) {
    if (!jackpotData) return null;

    return (
        <section className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 md:p-8 border border-gray-700 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col items-center justify-center text-center">
            <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>

            <h2 className="text-xl md:text-2xl font-bold text-gray-300 mb-2 drop-shadow-sm flex items-center justify-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                Giá trị Jackpot Ước Tính
            </h2>

            {activeTab === 'Mega645' ? (
                <p className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 drop-shadow-lg tracking-tight">
                    {jackpotData.jackpot1} VNĐ
                </p>
            ) : (
                <div className="flex flex-col items-center gap-1 md:gap-2">
                    <p className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 drop-shadow-lg">
                        JP1: {jackpotData.jackpot1} VNĐ
                    </p>
                    {jackpotData.jackpot2 && (
                        <p className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                            JP2: {jackpotData.jackpot2} VNĐ
                        </p>
                    )}
                </div>
            )}

            <div className="mt-4 md:mt-6 flex items-center gap-2 text-gray-300 bg-gray-800/80 px-5 py-2.5 rounded-xl border border-gray-700 shadow-inner">
                <Timer className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-medium text-gray-400">Kỳ xổ tiếp theo:</span>
                <span className="text-lg font-mono font-bold text-amber-300 tabular-nums tracking-wider">{countdown}</span>
            </div>
        </section>
    );
}
