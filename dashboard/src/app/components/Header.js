import Link from 'next/link';
import { Info, Wand2 } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, lastUpdated, onInfoOpen }) {
    return (
        <header className="flex flex-col md:flex-row items-center justify-between border-b border-gray-800 pb-3 md:pb-4 sticky top-0 z-50 bg-[#0E1217]/95 backdrop-blur-xl pt-3 md:pt-4 shadow-2xl rounded-b-xl md:rounded-b-2xl px-4 -mx-4 mb-4">
            <div className="text-center md:text-left w-full md:w-auto">
                <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-600 flex items-center justify-center md:justify-start gap-2 md:gap-3">
                    Vietlott Analytics
                </h1>
                <p className="text-gray-400 mt-1 md:mt-2 text-xs md:text-sm hidden md:block">Real-time statistics &amp; drawn frequency dashboard</p>
                {lastUpdated && (
                    <p className="text-emerald-400/80 mt-1.5 md:mt-2 text-[10px] md:text-xs font-mono bg-emerald-900/20 inline-block px-1.5 md:px-2 py-0.5 rounded border border-emerald-800/30">
                        ⏱ Dữ liệu đồng bộ lần cuối: {lastUpdated}
                    </p>
                )}
            </div>

            <div className="mt-3 md:mt-0 flex p-1 bg-gray-900 rounded-xl border border-gray-800 shadow-inner w-full md:w-auto">
                <button
                    onClick={() => setActiveTab('Mega645')}
                    className={`flex-1 md:flex-none text-center px-4 md:px-6 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${activeTab === 'Mega645' ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    Mega 6/45
                </button>
                <button
                    onClick={() => setActiveTab('Power655')}
                    className={`flex-1 md:flex-none text-center px-4 md:px-6 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${activeTab === 'Power655' ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    Power 6/55
                </button>
            </div>

            <div className="mt-3 md:mt-0 flex items-center justify-center md:justify-end gap-2 md:gap-3 w-full md:w-auto">
                <button
                    onClick={onInfoOpen}
                    className="flex-1 md:flex-none flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 md:py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl font-semibold transition-all shadow-lg border border-gray-700 text-xs md:text-sm"
                >
                    <Info className="w-4 h-4 md:w-4 md:h-4" />
                    <span className="inline">Giới Thiệu</span>
                </button>
                <Link
                    href="/predict"
                    className="flex-1 md:flex-none flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-indigo-500/30 border border-indigo-400/30 text-xs md:text-sm"
                >
                    <Wand2 className="w-4 h-4 md:w-4 md:h-4" />
                    Dự Đoán
                </Link>
            </div>
        </header>
    );
}
