import { useState, useEffect, useRef } from 'react';
import { Wand2, X, AlertCircle, Loader2, Trash2, ArrowDown, RefreshCw, Send } from 'lucide-react';
import Ball from './Ball';

export default function PredictModal({
    isOpen, onClose, activeTab, data,
    inputNumber, setInputNumber,
    tickets, predictError,
    onPredict, onUpdateTicket, onClearTicket,
    algorithmType, setAlgorithmType, isPredicting
}) {
    const [activeTicketIndex, setActiveTicketIndex] = useState(0);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            const timer = setTimeout(() => {
                inputRef.current.focus();
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        let val = e.target.value.replace(/\D/g, ''); 
        if (val.length > 6) val = val.slice(0, 6); 
        const formatted = val.match(/.{1,2}/g)?.join(' ') || '';
        setInputNumber(formatted);
    };

    const handlePredictClick = (type = 'all', index = 0) => {
        if (type === 'single') setActiveTicketIndex(index);
        onPredict(type, index);
    };

    const handleGridToggle = (strNum) => {
        const currentTicket = tickets[activeTicketIndex] || [];
        if (currentTicket.includes(strNum)) {
            // Remove
            onUpdateTicket(activeTicketIndex, currentTicket.filter(n => n !== strNum));
        } else {
            // Add if < 6
            if (currentTicket.length < 6) {
                const newTicket = [...currentTicket, strNum].sort((a,b)=> parseInt(a)-parseInt(b));
                onUpdateTicket(activeTicketIndex, newTicket);
            }
        }
    };

    const maxGridNum = activeTab === 'Mega645' ? 45 : 55;
    const gridNumbers = Array.from({length: maxGridNum}, (_, i) => String(i + 1).padStart(2, '0'));

    const handleCopySMS = () => {
        const validTickets = tickets.filter(t => t && t.length === 6);
        if (validTickets.length === 0) return;
        
        const code = activeTab === 'Mega645' ? '645' : '655';
        const smsBody = `${code} K1 ${validTickets.map(t => `S ${t.join(' ')}`).join(' ')}`;
        
        // for mobile
        window.location.href = `sms:9969?body=${encodeURIComponent(smsBody)}`;
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pt-10 pb-0 px-0 md:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-gray-900 border-t border-gray-700 md:border md:rounded-2xl shadow-2xl w-full max-w-md relative animate-in slide-in-from-bottom flex flex-col h-[90vh] md:max-h-[95vh] rounded-t-2xl overflow-hidden">
                {/* Header fixed */}
                <div className="p-4 border-b border-gray-800 shrink-0 relative bg-gray-900 z-10">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                    <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 mb-2">
                        <Wand2 className="w-6 h-6 text-purple-400" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 drop-shadow-sm">Dự Đoán</span>
                        <span className="px-3 py-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-[0_0_15px_rgba(147,51,234,0.4)] border border-purple-400/50 text-lg md:text-xl tracking-wide">
                            {activeTab === 'Mega645' ? 'Mega 6/45' : 'Power 6/55'}
                        </span>
                    </h2>
                    <div className="flex bg-gray-800 rounded-lg p-1 mt-3 border border-gray-700">
                        <button
                            onClick={() => setAlgorithmType('co-occurrence')}
                            className={`flex-1 py-1.5 text-xs md:text-sm font-semibold rounded-md transition-all ${algorithmType === 'co-occurrence' ? 'bg-indigo-600 text-white shadow-md cursor-default' : 'text-gray-400 hover:text-gray-200'}`}
                        >
                            Cơ Bản (Mặc định)
                        </button>
                        <button
                            onClick={() => setAlgorithmType('4-layer')}
                            className={`flex-1 py-1.5 text-xs md:text-sm font-semibold rounded-md transition-all ${algorithmType === '4-layer' ? 'bg-purple-600 text-white shadow-md cursor-default' : 'text-gray-400 hover:text-gray-200'}`}
                        >
                            4 Lớp (Nâng cao)
                        </button>
                    </div>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 md:p-4 relative flex flex-col">
                    <div className="flex gap-2 mb-4 shrink-0">
                        <input
                            ref={inputRef}
                            type="text"
                            inputMode="numeric"
                            value={inputNumber}
                            onChange={handleInputChange}
                            onKeyDown={(e) => e.key === 'Enter' && handlePredictClick('single', activeTicketIndex)}
                            placeholder="Nhập hạt giống (VD: 08 12)"
                            className="flex-1 min-w-0 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:placeholder-transparent transition-all font-mono text-sm"
                        />
                        <button onClick={() => handlePredictClick('single', activeTicketIndex)} disabled={isPredicting} className="px-3 md:px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg transition-colors flex items-center justify-center min-w-[55px] md:min-w-[60px] text-sm md:text-base">
                            {isPredicting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Tìm'}
                        </button>
                        <button onClick={() => handlePredictClick('all')} disabled={isPredicting} className="px-2 md:px-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white rounded-xl font-bold shadow-lg transition-colors flex items-center justify-center whitespace-nowrap text-sm">
                            {isPredicting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : 'Tạo 5 Vé'}
                        </button>
                    </div>

                    {predictError && (
                        <div className="text-red-400 text-xs md:text-sm mb-4 px-2 flex items-center gap-1 shrink-0">
                            <AlertCircle className="w-4 h-4" /> {predictError}
                        </div>
                    )}

                    {/* Tickets List */}
                    <div className="flex flex-col gap-0.5 shrink-0 relative bg-gray-900 rounded-xl">
                        {tickets.map((ticketNums, i) => {
                            const isActive = activeTicketIndex === i;
                            const hasNums = ticketNums && ticketNums.length > 0;
                            return (
                                <div 
                                    key={i} 
                                    onClick={() => setActiveTicketIndex(i)}
                                    className={`flex items-center gap-1 sm:gap-2 px-2 py-1 md:py-1.5 rounded-lg transition-all cursor-pointer ${isActive ? 'bg-gray-800/70 shadow-sm' : 'bg-transparent hover:bg-gray-800/40'}`}
                                >
                                    <span className={`w-4 sm:w-6 font-bold text-center text-sm ${isActive ? 'text-indigo-400' : 'text-gray-500'}`}>{String.fromCharCode(65 + i)}</span>
                                    <div className="flex-1 flex gap-0.5 justify-center relative items-center min-h-[30px] md:min-h-[40px]">
                                        {[0,1,2,3,4,5].map(j => {
                                            const num = hasNums ? ticketNums[j] : null;
                                            return (
                                                <div key={j} className="transform scale-[0.6] sm:scale-[0.75] origin-center -mx-1.5 sm:-mx-[6px]">
                                                    {num ? (
                                                        <Ball num={num} />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-full bg-gray-800/60 shadow-inner [box-shadow:inset_0_-2px_6px_rgba(0,0,0,0.5)] border-[2px] border-gray-700/30"></div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="flex shrink-0 w-8 justify-center">
                                        {hasNums ? (
                                            <button onClick={(e) => { e.stopPropagation(); onClearTicket(i); }} className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4 sm:w-5 sm:h-5" /></button>
                                        ) : (
                                            <button onClick={(e) => { e.stopPropagation(); handlePredictClick('single', i); }} className={`p-1.5 transition-colors ${isActive ? 'text-indigo-400' : 'text-gray-500 hover:text-indigo-300'}`}><RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${isPredicting && isActive ? 'animate-spin' : ''}`} /></button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Grid List */}
                    <div className="mt-3 pt-3 border-t border-gray-800">
                        <div className="flex items-center justify-center gap-1.5 text-[9px] md:text-[10px] font-semibold text-gray-500 mb-2.5 tracking-wider uppercase">
                            <ArrowDown className="w-2.5 h-2.5 md:w-3 md:h-3" /> Bấm để đổi số cho Vé <span className="text-indigo-400 font-bold">{String.fromCharCode(65 + activeTicketIndex)}</span> <ArrowDown className="w-2.5 h-2.5 md:w-3 md:h-3" />
                        </div>
                        <div className="grid grid-cols-8 gap-1.5 sm:gap-2 mx-auto justify-items-center max-w-fit">
                            {gridNumbers.map(strNum => {
                                const activeTicket = tickets[activeTicketIndex] || [];
                                const isActive = activeTicket.includes(strNum);
                                const parsedInput = inputNumber.trim().split(/\s+/).filter(Boolean).map(n => n.padStart(2, '0'));
                                const isInput = parsedInput.includes(strNum);
                                
                                return (
                                    <button 
                                        key={strNum} 
                                        disabled={!isActive && activeTicket.length >= 6}
                                        onClick={() => handleGridToggle(strNum)}
                                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all transform active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed ${
                                            isActive 
                                                ? (isInput ? 'bg-amber-500 text-white shadow-lg ring-2 ring-amber-300/50' : 'bg-red-500 text-white shadow-lg shadow-red-500/20 ring-2 ring-red-400/50')
                                                : 'bg-white text-gray-800 hover:bg-gray-200 shadow-sm'
                                        }`}
                                    >
                                        {strNum}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Spacer for absolute footer */}
                    <div className="h-28 w-full shrink-0"></div>
                </div>

                {/* Footer fixed */}
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gray-900 border-t border-gray-800 z-10 w-full">
                    <button
                        onClick={handleCopySMS}
                        disabled={!tickets.some(t => t && t.length === 6)}
                        className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white rounded-xl font-bold shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-all flex items-center justify-center gap-2 md:text-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 disabled:shadow-none"
                    >
                        <Send className="w-4 h-4 md:w-5 md:h-5" />
                        Mua Vé Ngay Qua SMS
                    </button>
                    <p className="text-[10px] text-gray-500 text-center mt-1.5 font-medium">Cú pháp sẽ được sinh tự động gửi đến 9969 (Đại lý Vietlott)</p>
                </div>
            </div>
        </div>
    );
}
