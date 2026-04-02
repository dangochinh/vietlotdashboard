import { useState, useEffect, useRef } from 'react';
import { Wand2, X, AlertCircle, Send, Loader2, Copy, Check } from 'lucide-react';
import Ball from './Ball';

export default function PredictModal({
    isOpen, onClose, activeTab, data,
    inputNumber, setInputNumber,
    predictedNumbers, predictError,
    onPredict, onReroll, algorithmType, setAlgorithmType, isPredicting
}) {
    const [spinningIndex, setSpinningIndex] = useState(-1);
    const [excludedHistory, setExcludedHistory] = useState([]);
    const [copied, setCopied] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            // Slight delay ensures the UI is painted before grabbing focus
            const timer = setTimeout(() => {
                inputRef.current.focus();
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        let val = e.target.value.replace(/\D/g, ''); // chỉ lấy số
        if (val.length > 6) val = val.slice(0, 6); // tối đa 6 ký tự (3 số)
        const formatted = val.match(/.{1,2}/g)?.join(' ') || '';
        setInputNumber(formatted);
    };

    const handlePredictClick = () => {
        setExcludedHistory([]);
        onPredict();
    };

    const handleBallClick = (idx) => {
        if (spinningIndex !== -1) return; // Prevent double clicks
        
        setSpinningIndex(idx);
        const oldNum = predictedNumbers[idx];
        const newExcluded = [...excludedHistory, oldNum];
        setExcludedHistory(newExcluded);

        // Fake delay for animation satisfaction
        setTimeout(() => {
            onReroll(idx, newExcluded);
            setSpinningIndex(-1);
        }, 400);
    };

    const handleCopy = () => {
        const inputArray = inputNumber.trim().split(/\s+/).filter(Boolean).map(n => n.padStart(2, '0'));
        const allNums = [...inputArray, ...predictedNumbers].sort((a, b) => parseInt(a) - parseInt(b));
        const code = activeTab === 'Mega645' ? '645' : '655';
        const smsBody = `${code} K1 S ${allNums.join(' ')}`;
        
        navigator.clipboard.writeText(smsBody).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-gray-900 border border-gray-700 p-6 rounded-2xl shadow-2xl w-full max-w-md relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
                    <Wand2 className="w-6 h-6 text-purple-400" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 drop-shadow-sm">Dự Đoán</span>
                    <span className="px-3 py-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg shadow-[0_0_15px_rgba(147,51,234,0.4)] border border-purple-400/50 text-xl tracking-wide">
                        {activeTab === 'Mega645' ? 'Mega 6/45' : 'Power 6/55'}
                    </span>
                </h2>

                <div className="flex bg-gray-800 rounded-lg p-1 mb-4 border border-gray-700">
                    <button
                        onClick={() => setAlgorithmType('co-occurrence')}
                        className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-all ${algorithmType === 'co-occurrence' ? 'bg-indigo-600 text-white shadow-md cursor-default' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                        Cơ Bản (Mặc định)
                    </button>
                    <button
                        onClick={() => setAlgorithmType('4-layer')}
                        className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-all ${algorithmType === '4-layer' ? 'bg-purple-600 text-white shadow-md cursor-default' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                        4 Lớp (Nâng cao)
                    </button>
                </div>

                <p className="text-gray-400 text-sm mb-6 min-h-[40px]">
                    {algorithmType === 'co-occurrence'
                        ? `Nhập 1-3 số bạn thích. Hệ thống sẽ phân tích toàn bộ lịch sử ${data.length} kỳ quay để tìm ra các số thường xuất hiện cùng Số đó nhất.`
                        : `Thuật toán quét 1.000.000 bộ số ngẫu nhiên qua 4 lớp lọc (Tổng, Chẵn Lẻ, Khoảng Cách, ...) kết hợp với số của bạn.`
                    }
                </p>

                <div className="flex gap-3 mb-4">
                    <input
                        ref={inputRef}
                        type="text"
                        inputMode="numeric"
                        value={inputNumber}
                        onChange={handleInputChange}
                        onKeyDown={(e) => e.key === 'Enter' && handlePredictClick()}
                        placeholder="Nhập tối đa 3 số (vd: 05 12)"
                        className="flex-1 min-w-0 w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:placeholder-transparent transition-all font-mono text-sm md:text-base text-center tracking-wide"
                    />
                    <button onClick={handlePredictClick} disabled={isPredicting} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold shadow-lg transition-colors flex items-center justify-center gap-2 min-w-[90px]">
                        {isPredicting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Tìm'}
                    </button>
                </div>

                {predictError && (
                    <div className="text-red-400 text-sm mb-4 px-2 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> {predictError}
                    </div>
                )}

                {predictedNumbers.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-800 animate-in fade-in slide-in-from-bottom-2 flex-1 overflow-y-auto custom-scrollbar">
                        <p className="text-sm text-gray-400 mb-1 font-medium text-center">Bộ số gợi ý tốt nhất do hệ thống tính toán:</p>
                        <p className="text-xs text-purple-400 mb-4 font-medium text-center italic">👉 Bấm vào các bóng màu xanh/đỏ để đổi lấy số khác</p>
                        
                        <div className="flex flex-wrap gap-x-2 gap-y-4 justify-center pb-4">
                            {inputNumber.trim().split(/\s+/).filter(Boolean).map((n, i) => (
                                <div key={`input-${i}`} className="flex flex-col items-center">
                                    <Ball num={n.padStart(2, '0')} isSpecial={true} />
                                    <span className="text-[10px] text-amber-500 mt-1 uppercase font-black tracking-widest whitespace-nowrap">Của bạn</span>
                                </div>
                            ))}

                            <div className="w-px h-12 bg-gray-700 mx-1 align-middle self-start mt-0"></div>

                            {predictedNumbers.map((num, i) => (
                                <div key={`pred-${i}`} className="flex flex-col items-center">
                                    <Ball 
                                        num={num} 
                                        onClick={() => handleBallClick(i)}
                                        className={spinningIndex === i ? 'animate-[spin_0.4s_ease-in-out_infinite] opacity-50' : 'hover:-translate-y-1 hover:shadow-lg ring-2 ring-transparent hover:ring-indigo-400/50'}
                                    />
                                    <span className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-widest h-3">
                                        {spinningIndex === i ? 'Đang đổi...' : ''}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {predictedNumbers.length > 0 && (
                    <div className="mt-2 sticky bottom-0 bg-gray-900 pt-2 pb-1 z-10 animate-in fade-in slide-in-from-bottom-4">
                        <button
                            onClick={() => {
                                const inputArray = inputNumber.trim().split(/\s+/).filter(Boolean).map(n => n.padStart(2, '0'));
                                const allNums = [...inputArray, ...predictedNumbers].sort((a, b) => parseInt(a) - parseInt(b));
                                const code = activeTab === 'Mega645' ? '645' : '655';
                                const smsBody = `${code} K1 S ${allNums.join(' ')}`;
                                window.location.href = `sms:9969?body=${encodeURIComponent(smsBody)}`;
                            }}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all active:scale-[0.98]"
                        >
                            <Send className="w-5 h-5" />
                            Mua Vé Ngay Qua SMS
                        </button>
                        <div className="flex items-center gap-2 mt-3">
                            <div className="flex-1 h-px bg-gray-800"></div>
                            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Hoặc copy cú pháp</span>
                            <div className="flex-1 h-px bg-gray-800"></div>
                        </div>
                        <button
                            onClick={handleCopy}
                            className={`w-full mt-3 flex items-center justify-center gap-2 px-6 py-2.5 border rounded-xl font-bold transition-all ${copied 
                                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.1)]' 
                                : 'bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-300'}`}
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4" />
                                    Đã sao chép!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" />
                                    Sao chép cú pháp SMS
                                </>
                            )}
                        </button>
                        <p className="text-center text-[10px] text-gray-500 mt-2">Gửi cú pháp trên đến tổng đài 9969 (Vietlott SMS)</p>
                    </div>
                )}
            </div>
        </div>
    );
}
