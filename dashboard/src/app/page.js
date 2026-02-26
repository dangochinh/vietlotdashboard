"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { MAX_NUMBERS } from './lib/constants';
import { useVietlottData } from './hooks/useVietlottData';
import { useCountdown } from './hooks/useCountdown';
import { predictByCoOccurrence, predictBy4LayerFiltering } from './lib/prediction';

import Header from './components/Header';
import JackpotCard from './components/JackpotCard';
import FrequencyChart from './components/FrequencyChart';
import HistoryTable from './components/HistoryTable';
import PairsChart from './components/PairsChart';
import TriosChart from './components/TriosChart';
import ColdNumbersChart from './components/ColdNumbersChart';
import EvenOddPie from './components/EvenOddPie';
import SumScatter from './components/SumScatter';
import PredictModal from './components/PredictModal';
import ViewAllModal from './components/ViewAllModal';
import InfoModal from './components/InfoModal';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Mega645');

  // Modal States
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [viewAllModal, setViewAllModal] = useState({ open: false, title: '', type: null });
  const [predictModalOpen, setPredictModalOpen] = useState(false);
  const [inputNumber, setInputNumber] = useState('');
  const [predictedNumbers, setPredictedNumbers] = useState([]);
  const [predictError, setPredictError] = useState('');
  const [algorithmType, setAlgorithmType] = useState('co-occurrence');
  const [isPredicting, setIsPredicting] = useState(false);
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


  // Data hooks
  const { data, loading, error, jackpotData, lastUpdated } = useVietlottData(activeTab);
  const countdown = useCountdown(activeTab);

  // Prediction logic
  const handlePredict = () => {
    setIsPredicting(true);
    setPredictError('');
    setPredictedNumbers([]);

    // UI needs to update loading state before doing heavy compute loop
    setTimeout(() => {
      let result;
      if (algorithmType === 'co-occurrence') {
        result = predictByCoOccurrence(inputNumber, activeTab, data);
      } else {
        result = predictBy4LayerFiltering(inputNumber, activeTab, data, clientId);
      }

      setPredictError(result.error);
      if (result.numbers) setPredictedNumbers(result.numbers);
      setIsPredicting(false);
    }, 50);
  };
  // Computed data — uses English keys internally
  const frequencyData = useMemo(() => {
    if (!data || data.length === 0) return { top15: [], full: [] };
    const maxNum = MAX_NUMBERS[activeTab];
    const counts = {};
    for (let i = 1; i <= maxNum; i++) counts[i.toString().padStart(2, '0')] = 0;
    data.forEach(row => {
      for (let i = 1; i <= 6; i++) { if (row[`Số ${i}`]) counts[row[`Số ${i}`]] = (counts[row[`Số ${i}`]] || 0) + 1; }
      if (activeTab === 'Power655' && row['Số Đặc Biệt']) counts[row['Số Đặc Biệt']] = (counts[row['Số Đặc Biệt']] || 0) + 1;
    });
    const formatted = Object.keys(counts).map(key => ({ name: key, frequency: counts[key] })).sort((a, b) => b.frequency - a.frequency);
    return { top15: formatted.slice(0, 15), full: formatted };
  }, [data, activeTab]);

  const { pairData, trioData, pairDataFull, trioDataFull } = useMemo(() => {
    if (!data || data.length === 0) return { pairData: [], trioData: [], pairDataFull: [], trioDataFull: [] };
    const pairCounts = {}, trioCounts = {};
    data.forEach(row => {
      const numbers = [];
      for (let i = 1; i <= 6; i++) { if (row[`Số ${i}`]) numbers.push(row[`Số ${i}`]); }
      numbers.sort((a, b) => parseInt(a) - parseInt(b));
      const n = numbers.length;
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const k = `${numbers[i]} - ${numbers[j]}`; pairCounts[k] = (pairCounts[k] || 0) + 1; }
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) for (let k = j + 1; k < n; k++) { const key = `${numbers[i]} - ${numbers[j]} - ${numbers[k]}`; trioCounts[key] = (trioCounts[key] || 0) + 1; }
    });
    const sp = Object.keys(pairCounts).map(k => ({ name: k, frequency: pairCounts[k] })).sort((a, b) => b.frequency - a.frequency);
    const st = Object.keys(trioCounts).map(k => ({ name: k, frequency: trioCounts[k] })).sort((a, b) => b.frequency - a.frequency);
    return { pairData: sp.slice(0, 15), trioData: st.slice(0, 15), pairDataFull: sp, trioDataFull: st };
  }, [data]);

  const coldNumbersData = useMemo(() => {
    if (!data || data.length === 0) return { top15: [], full: [] };
    const maxNum = MAX_NUMBERS[activeTab];
    const lastSeen = {};
    for (let i = 1; i <= maxNum; i++) lastSeen[i.toString().padStart(2, '0')] = -1;
    for (let drawIdx = 0; drawIdx < data.length; drawIdx++) {
      const row = data[drawIdx];
      for (let i = 1; i <= 6; i++) { const num = row[`Số ${i}`]; if (num && lastSeen[num] === -1) lastSeen[num] = drawIdx; }
      if (activeTab === 'Power655' && row['Số Đặc Biệt']) { const num = row['Số Đặc Biệt']; if (num && lastSeen[num] === -1) lastSeen[num] = drawIdx; }
    }
    Object.keys(lastSeen).forEach(k => { if (lastSeen[k] === -1) lastSeen[k] = data.length; });
    const formatted = Object.keys(lastSeen).map(k => ({ name: k, drawsAbsent: lastSeen[k] })).sort((a, b) => b.drawsAbsent - a.drawsAbsent);
    return { top15: formatted.slice(0, 15), full: [...formatted].sort((a, b) => a.drawsAbsent - b.drawsAbsent) };
  }, [data, activeTab]);

  const evenOddData = useMemo(() => {
    if (!data || data.length === 0) return [];
    const counts = { '6 Chẵn - 0 Lẻ': 0, '5 Chẵn - 1 Lẻ': 0, '4 Chẵn - 2 Lẻ': 0, '3 Chẵn - 3 Lẻ': 0, '2 Chẵn - 4 Lẻ': 0, '1 Chẵn - 5 Lẻ': 0, '0 Chẵn - 6 Lẻ': 0 };
    data.forEach(row => {
      let evens = 0, odds = 0;
      for (let i = 1; i <= 6; i++) { const num = parseInt(row[`Số ${i}`]); if (!isNaN(num)) { if (num % 2 === 0) evens++; else odds++; } }
      if (evens + odds === 6) counts[`${evens} Chẵn - ${odds} Lẻ`] += 1;
    });
    return Object.keys(counts).filter(k => counts[k] > 0).map(k => ({ name: k, value: counts[k] }));
  }, [data]);

  const sumData = useMemo(() => {
    if (!data || data.length === 0) return [];
    const recentData = data.slice(0, 100).reverse();
    return recentData.map((row, index) => {
      let sum = 0;
      for (let i = 1; i <= 6; i++) { const val = parseInt(row[`Số ${i}`]); if (!isNaN(val)) sum += val; }
      return { drawId: row['Kỳ QSMT'] || index, index: index + 1, sum };
    });
  }, [data]);

  return (
    <div className="min-h-screen bg-[#0E1217] text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          lastUpdated={lastUpdated}
          onInfoOpen={() => setInfoModalOpen(true)}
          onPredictOpen={() => { setPredictModalOpen(true); setPredictError(''); setPredictedNumbers([]); setInputNumber(''); }}
        />

        <PredictModal
          isOpen={predictModalOpen}
          onClose={() => setPredictModalOpen(false)}
          activeTab={activeTab}
          data={data}
          inputNumber={inputNumber}
          setInputNumber={setInputNumber}
          predictedNumbers={predictedNumbers}
          predictError={predictError}
          onPredict={handlePredict}
          algorithmType={algorithmType}
          setAlgorithmType={setAlgorithmType}
          isPredicting={isPredicting}
        />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl flex items-center gap-3 text-red-400">
            <AlertCircle /> <span>{error}</span>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            <p className="text-xl">Chưa có dữ liệu cho {activeTab}.</p>
            <p className="text-sm mt-2">Vui lòng kiểm tra Google Sheet hoặc chạy Github Actions Scraper.</p>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <JackpotCard activeTab={activeTab} jackpotData={jackpotData} countdown={countdown} />

            {/* Grid 1: Frequency + History */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <FrequencyChart data={frequencyData} onViewAll={setViewAllModal} />
              <HistoryTable data={data} activeTab={activeTab} />
            </div>

            {/* Grid 2: Pairs + Trios */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <PairsChart data={pairData} onViewAll={setViewAllModal} />
              <TriosChart data={trioData} onViewAll={setViewAllModal} />
            </div>

            {/* Grid 3: Cold Numbers + Even/Odd */}
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ColdNumbersChart data={coldNumbersData} onViewAll={setViewAllModal} />
                <EvenOddPie data={evenOddData} />
              </div>
              <SumScatter data={sumData} activeTab={activeTab} />
            </div>

            {/* Modals */}
            <ViewAllModal
              viewAllModal={viewAllModal}
              onClose={() => setViewAllModal({ open: false, title: '', type: null })}
              frequencyData={frequencyData}
              pairDataFull={pairDataFull}
              trioDataFull={trioDataFull}
              coldNumbersData={coldNumbersData}
            />
            <InfoModal isOpen={infoModalOpen} onClose={() => setInfoModalOpen(false)} />
          </div>
        )}
      </div>
    </div>
  );
}
