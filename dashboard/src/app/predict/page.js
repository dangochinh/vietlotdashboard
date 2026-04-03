"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Wand2, AlertCircle, Loader2, Trash2, ArrowDown, RefreshCw, Send, ArrowLeft } from 'lucide-react';
import Ball from '../components/Ball';
import { MAX_NUMBERS } from '../lib/constants';
import { useVietlottData } from '../hooks/useVietlottData';
import { predictByCoOccurrence, predictBy4LayerFiltering } from '../lib/prediction';

export default function PredictPage() {
    const [activeTab, setActiveTab] = useState('Mega645');
    const [inputNumber, setInputNumber] = useState('');
    const [tickets, setTickets] = useState([[], [], [], [], []]);
    const [predictError, setPredictError] = useState('');
    const [algorithmType, setAlgorithmType] = useState('co-occurrence');
    const [isPredicting, setIsPredicting] = useState(false);
    const [activeTicketIndex, setActiveTicketIndex] = useState(0);
    const inputRef = useRef(null);

    const [clientId] = useState(() => {
        if (typeof window !== 'undefined') {
            let id = localStorage.getItem('vietlott_client_id');
            if (!id) {
                id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                localStorage.setItem('vietlott_client_id', id);
            }
            return id;
        }
        return '';
    });

    const { data, loading } = useVietlottData(activeTab);

    // Reset tickets when switching tabs
    useEffect(() => {
        setTickets([[], [], [], [], []]);
        setPredictError('');
        setInputNumber('');
        setActiveTicketIndex(0);
    }, [activeTab]);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleInputChange = (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 6) val = val.slice(0, 6);
        const formatted = val.match(/.{1,2}/g)?.join(' ') || '';
        setInputNumber(formatted);
    };

    const handlePredict = (type = 'all', targetIndex = 0) => {
        setIsPredicting(true);
        setPredictError('');

        setTimeout(() => {
            const rawInput = inputNumber.replace(/[^0-9]/g, ' ').trim();
            const inputArray = rawInput ? rawInput.split(/\s+/).map(n => n.padStart(2, '0')) : [];

            const uniqueInputs = new Set(inputArray);
            if (uniqueInputs.size !== inputArray.length) {
                setPredictError("Vui lòng không nhập các số trùng nhau");
                setIsPredicting(false);
                return;
            }
            if (inputArray.length < 1 || inputArray.length > 3) {
                setPredictError("Vui lòng nhập từ 1 đến 3 số");
                setIsPredicting(false);
                return;
            }

            const maxNum = MAX_NUMBERS[activeTab];
            const invalidNumber = inputArray.find(n => parseInt(n) < 1 || parseInt(n) > maxNum);
            if (invalidNumber) {
                setPredictError(`Vui lòng nhập số từ 01 đến ${maxNum}`);
                setIsPredicting(false);
                return;
            }

            const targetCount = 6 - inputArray.length;
            const newTickets = [...tickets];
            let hasError = false;

            if (type === 'all') {
                for (let i = 0; i < 5; i++) {
                    let result;
                    if (algorithmType === 'co-occurrence') {
                        result = predictByCoOccurrence(inputArray, targetCount, activeTab, data, [], i);
                    } else {
                        result = predictBy4LayerFiltering(inputArray, targetCount, activeTab, data, clientId, [], Date.now() + i);
                    }
                    if (!result.error) {
                        newTickets[i] = [...inputArray, ...result.numbers].sort((a, b) => parseInt(a) - parseInt(b));
                    } else {
                        setPredictError(result.error);
                        hasError = true;
                        break;
                    }
                }
            } else {
                let result;
                if (algorithmType === 'co-occurrence') {
                    result = predictByCoOccurrence(inputArray, targetCount, activeTab, data, [], targetIndex);
                } else {
                    result = predictBy4LayerFiltering(inputArray, targetCount, activeTab, data, clientId, [], Date.now());
                }
                if (!result.error) {
                    newTickets[targetIndex] = [...inputArray, ...result.numbers].sort((a, b) => parseInt(a) - parseInt(b));
                } else {
                    setPredictError(result.error);
                    hasError = true;
                }
            }

            if (!hasError) setTickets(newTickets);
            setIsPredicting(false);
        }, 50);
    };

    const handlePredictClick = (type = 'all', index = 0) => {
        if (type === 'single') setActiveTicketIndex(index);
        handlePredict(type, index);
    };

    const handleUpdateTicket = (ticketIndex, newNumbers) => {
        const newTickets = [...tickets];
        newTickets[ticketIndex] = newNumbers;
        setTickets(newTickets);
    };

    const handleClearTicket = (ticketIndex) => {
        const newTickets = [...tickets];
        newTickets[ticketIndex] = [];
        setTickets(newTickets);
    };

    const handleGridToggle = (strNum) => {
        const currentTicket = tickets[activeTicketIndex] || [];
        if (currentTicket.includes(strNum)) {
            handleUpdateTicket(activeTicketIndex, currentTicket.filter(n => n !== strNum));
        } else {
            if (currentTicket.length < 6) {
                const newTicket = [...currentTicket, strNum].sort((a, b) => parseInt(a) - parseInt(b));
                handleUpdateTicket(activeTicketIndex, newTicket);
            }
        }
    };

    const maxGridNum = activeTab === 'Mega645' ? 45 : 55;
    const gridNumbers = Array.from({ length: maxGridNum }, (_, i) => String(i + 1).padStart(2, '0'));

    const handleCopySMS = () => {
        const validTickets = tickets.filter(t => t && t.length === 6);
        if (validTickets.length === 0) return;

        const code = activeTab === 'Mega645' ? '645' : '655';
        const smsBody = `${code} K1 ${validTickets.map(t => `S ${t.join(' ')}`).join(' ')}`;
        window.location.href = `sms:9969?body=${encodeURIComponent(smsBody)}`;
    };

    return (
        <div className="min-h-screen bg-[#0E1217] text-white font-sans">
            {/* Top Navigation Bar */}
            <div className="sticky top-0 z-50 bg-[#0E1217]/95 backdrop-blur-xl border-b border-gray-800 shadow-2xl">
                <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                        <span className="text-sm font-medium hidden sm:inline">Dashboard</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <Wand2 className="w-5 h-5 text-purple-400" />
                        <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                            Dự Đoán
                        </h1>
                    </div>

                    {/* Ticket type toggle */}
                    <div className="flex bg-gray-900 rounded-lg p-0.5 border border-gray-700">
                        <button
                            onClick={() => setActiveTab('Mega645')}
                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'Mega645'
                                ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            6/45
                        </button>
                        <button
                            onClick={() => setActiveTab('Power655')}
                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'Power655'
                                ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            6/55
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-3xl mx-auto px-4 pt-4 pb-28">
                {loading ? (
                    <div className="flex flex-col justify-center items-center h-64 gap-3">
                        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
                        <p className="text-gray-400 text-sm">Đang tải dữ liệu {activeTab === 'Mega645' ? 'Mega 6/45' : 'Power 6/55'}...</p>
                    </div>
                ) : (
                    <>
                        {/* Algorithm Selector */}
                        <div className="flex bg-gray-800/60 rounded-xl p-1 mb-4 border border-gray-700/50">
                            <button
                                onClick={() => setAlgorithmType('co-occurrence')}
                                className={`flex-1 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all ${algorithmType === 'co-occurrence' ? 'bg-indigo-600 text-white shadow-md cursor-default' : 'text-gray-400 hover:text-gray-200'}`}
                            >
                                🎯 Cơ Bản (Mặc định)
                            </button>
                            <button
                                onClick={() => setAlgorithmType('4-layer')}
                                className={`flex-1 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all ${algorithmType === '4-layer' ? 'bg-purple-600 text-white shadow-md cursor-default' : 'text-gray-400 hover:text-gray-200'}`}
                            >
                                🧠 4 Lớp (Nâng cao)
                            </button>
                        </div>

                        {/* Input + Actions */}
                        <div className="flex gap-2 mb-4">
                            <input
                                ref={inputRef}
                                type="text"
                                inputMode="numeric"
                                value={inputNumber}
                                onChange={handleInputChange}
                                onKeyDown={(e) => e.key === 'Enter' && handlePredictClick('single', activeTicketIndex)}
                                placeholder="Nhập hạt giống (VD: 08 12)"
                                className="flex-1 min-w-0 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:placeholder-transparent transition-all font-mono text-sm"
                            />
                            <button
                                onClick={() => handlePredictClick('single', activeTicketIndex)}
                                disabled={isPredicting}
                                className="px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg transition-colors flex items-center justify-center min-w-[60px] text-sm"
                            >
                                {isPredicting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Tìm'}
                            </button>
                            <button
                                onClick={() => handlePredictClick('all')}
                                disabled={isPredicting}
                                className="px-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white rounded-xl font-bold shadow-lg transition-colors flex items-center justify-center whitespace-nowrap text-sm"
                            >
                                {isPredicting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : 'Tạo 5 Vé'}
                            </button>
                        </div>

                        {predictError && (
                            <div className="text-red-400 text-sm mb-4 px-2 flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 rounded-lg py-2">
                                <AlertCircle className="w-4 h-4 shrink-0" /> {predictError}
                            </div>
                        )}

                        {/* Tickets List */}
                        <div className="flex flex-col gap-1 bg-gray-900/50 rounded-xl border border-gray-800/50 p-2 mb-4">
                            {tickets.map((ticketNums, i) => {
                                const isActive = activeTicketIndex === i;
                                const hasNums = ticketNums && ticketNums.length > 0;
                                return (
                                    <div
                                        key={i}
                                        onClick={() => setActiveTicketIndex(i)}
                                        className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 md:py-2 rounded-xl transition-all cursor-pointer ${isActive ? 'bg-gray-800/80 shadow-sm ring-1 ring-indigo-500/30' : 'bg-transparent hover:bg-gray-800/40'}`}
                                    >
                                        <span className={`w-6 sm:w-7 font-bold text-center text-sm ${isActive ? 'text-indigo-400' : 'text-gray-500'}`}>
                                            {String.fromCharCode(65 + i)}
                                        </span>
                                        <div className="flex-1 flex gap-0.5 sm:gap-1 justify-center relative items-center min-h-[36px] md:min-h-[44px]">
                                            {[0, 1, 2, 3, 4, 5].map(j => {
                                                const num = hasNums ? ticketNums[j] : null;
                                                return (
                                                    <div key={j} className="transform scale-[0.65] sm:scale-[0.8] md:scale-[0.85] origin-center -mx-1.5 sm:-mx-1">
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
                                                <button onClick={(e) => { e.stopPropagation(); handleClearTicket(i); }} className="p-1.5 text-gray-500 hover:text-red-400 transition-colors">
                                                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                                </button>
                                            ) : (
                                                <button onClick={(e) => { e.stopPropagation(); handlePredictClick('single', i); }} className={`p-1.5 transition-colors ${isActive ? 'text-indigo-400' : 'text-gray-500 hover:text-indigo-300'}`}>
                                                    <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${isPredicting && isActive ? 'animate-spin' : ''}`} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Grid Section */}
                        <div className="bg-gray-900/50 rounded-xl border border-gray-800/50 p-3 sm:p-4">
                            <div className="flex items-center justify-center gap-1.5 text-[10px] md:text-xs font-semibold text-gray-500 mb-3 tracking-wider uppercase">
                                <ArrowDown className="w-3 h-3" /> Bấm để đổi số cho Vé <span className="text-indigo-400 font-bold">{String.fromCharCode(65 + activeTicketIndex)}</span> <ArrowDown className="w-3 h-3" />
                            </div>
                            <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5 sm:gap-2 mx-auto justify-items-center max-w-fit">
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
                                            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all transform active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed ${isActive
                                                ? `${parseInt(strNum) > 40 ? 'bg-red-500 shadow-red-500/20' : 'bg-blue-600 shadow-blue-500/20'} text-white shadow-lg ${isInput ? 'ring-4 ring-amber-400 ring-offset-1 ring-offset-gray-900 z-10' : 'ring-2 ring-white/30'}`
                                                : 'bg-white text-gray-800 hover:bg-gray-200 shadow-sm'
                                                }`}
                                        >
                                            {strNum}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Fixed Bottom Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#0E1217]/95 backdrop-blur-xl border-t border-gray-800 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
                <div className="max-w-3xl mx-auto px-4 py-3">
                    <button
                        onClick={handleCopySMS}
                        disabled={!tickets.some(t => t && t.length === 6)}
                        className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all flex items-center justify-center gap-2 text-base active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 disabled:shadow-none"
                    >
                        <Send className="w-5 h-5" />
                        Mua Vé Ngay Qua SMS
                    </button>
                    <p className="text-[10px] text-gray-500 text-center mt-1.5 font-medium">Cú pháp sẽ được sinh tự động gửi đến 9969 (Đại lý Vietlott)</p>
                </div>
            </div>
        </div>
    );
}
