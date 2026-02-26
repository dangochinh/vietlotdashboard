import { MAX_NUMBERS } from './constants';

// ---- ALGORITHM 1: CO-OCCURRENCE (DEFAULT) ----
export function predictByCoOccurrence(inputNumber, activeTab, data) {
    let num = inputNumber.trim();
    if (num.length === 1) num = '0' + num;
    const maxNum = MAX_NUMBERS[activeTab];

    if (!num || isNaN(num) || parseInt(num) < 1 || parseInt(num) > maxNum) {
        return { error: `Vui lòng nhập số từ 01 đến ${maxNum}`, numbers: [] };
    }

    const relevantDraws = data.filter(row => {
        for (let i = 1; i <= 6; i++) { if (row[`Số ${i}`] === num) return true; }
        return false;
    });

    if (relevantDraws.length === 0) {
        return { error: 'Chưa có lịch sử đủ dài cho số này.', numbers: [] };
    }

    const counts = {};
    relevantDraws.forEach(row => {
        for (let i = 1; i <= 6; i++) {
            const val = row[`Số ${i}`];
            if (val && val !== num) counts[val] = (counts[val] || 0) + 1;
        }
    });

    const topChoices = Object.keys(counts).filter(k => counts[k] > 0).sort((a, b) => counts[b] - counts[a]).slice(0, 5);
    if (topChoices.length === 0) {
        return { error: 'Số này chưa từng xuất hiện cùng số nào khác.', numbers: [] };
    }

    return { error: '', numbers: topChoices.sort((a, b) => parseInt(a) - parseInt(b)) };
}

// ---- ALGORITHM 2: 4-LAYER FILTERING ----
export function predictBy4LayerFiltering(inputNumber, activeTab, data) {
    let num = inputNumber.trim();
    if (num.length === 1) num = '0' + num;
    const maxNum = MAX_NUMBERS[activeTab];

    if (!num || isNaN(num) || parseInt(num) < 1 || parseInt(num) > maxNum) {
        return { error: `Vui lòng nhập số từ 01 đến ${maxNum}`, numbers: [] };
    }

    if (!data || data.length < 50) {
        return { error: 'Cần ít nhất 50 kỳ lịch sử để phân tích Layer 4.', numbers: [] };
    }

    // 1. Pre-compute Layer 4 Data
    const lastDraw = [];
    for (let i = 1; i <= 6; i++) {
        if (data[0][`Số ${i}`]) lastDraw.push(data[0][`Số ${i}`]);
    }

    const recent50 = data.slice(0, 50);
    const counts = {};
    for (let i = 1; i <= maxNum; i++) counts[i.toString().padStart(2, '0')] = 0;

    recent50.forEach(row => {
        for (let i = 1; i <= 6; i++) {
            const val = row[`Số ${i}`];
            if (val) counts[val]++;
        }
    });

    const frequencyList = Object.entries(counts).map(([k, v]) => ({ num: k, freq: v })).sort((a, b) => b.freq - a.freq);
    const hotNumbers = frequencyList.slice(0, 15).map(i => i.num); // Top 15 are "Hot"
    const coldNumbers = frequencyList.slice(-15).map(i => i.num); // Bottom 15 are "Cold"

    // Set constraint parameters based on game type
    const MIN_SUM = activeTab === 'Mega645' ? 110 : 130;
    const MAX_SUM = activeTab === 'Mega645' ? 160 : 180;
    const HIGH_THRESHOLD = activeTab === 'Mega645' ? 22 : 27;

    // Helper: Pick random element from array
    const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const pickRandomSet = (arr, count, exclude = []) => {
        const available = arr.filter(x => !exclude.includes(x));
        const result = [];
        for (let i = 0; i < count; i++) {
            if (available.length === 0) break;
            const idx = Math.floor(Math.random() * available.length);
            result.push(available[idx]);
            available.splice(idx, 1);
        }
        return result;
    };

    // 2. Monte Carlo Generation Loop (Max 1,000,000 iterations)
    const MAX_ITERATIONS = 1000000;
    let bestSet = null;
    let bestScore = -1;

    for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
        const candidateSet = new Set();
        candidateSet.add(num);

        // Pick 1 from last draw
        const lDraw = pickRandomSet(lastDraw, 1, Array.from(candidateSet));
        if (lDraw.length) candidateSet.add(lDraw[0]);

        // Pick 1 cold number
        const cNum = pickRandomSet(coldNumbers, 1, Array.from(candidateSet));
        if (cNum.length) candidateSet.add(cNum[0]);

        // Pick 3 hot numbers (or however many needed to reach 6)
        const hNums = pickRandomSet(hotNumbers, 6 - candidateSet.size, Array.from(candidateSet));
        hNums.forEach(n => candidateSet.add(n));

        // Fill remaining randomly if strict sets overlapped too much
        let safetyCounter = 0;
        while (candidateSet.size < 6 && safetyCounter < 100) {
            const rand = Math.floor(Math.random() * maxNum) + 1;
            candidateSet.add(rand.toString().padStart(2, '0'));
            safetyCounter++;
        }

        const sortedCombination = Array.from(candidateSet).sort((a, b) => parseInt(a) - parseInt(b));

        // Score this combination (Lower is better, 0 is perfect)
        let penalties = 0;

        // LAYER 1: Sum Range
        const sum = sortedCombination.reduce((acc, val) => acc + parseInt(val), 0);
        if (sum < MIN_SUM || sum > MAX_SUM) penalties += 10;

        // LAYER 2: Even/Odd & Low/High Balance (Requires 3:3, 4:2, or 2:4)
        let evens = 0;
        let lows = 0;
        sortedCombination.forEach(val => {
            const n = parseInt(val);
            if (n % 2 === 0) evens++;
            if (n <= HIGH_THRESHOLD) lows++;
        });
        if (evens === 0 || evens === 1 || evens === 5 || evens === 6) penalties += 5;
        if (lows === 0 || lows === 1 || lows === 5 || lows === 6) penalties += 5;

        // LAYER 3: Spacing (No 3 consecutives, at least two gaps > 5)
        let maxConsecutive = 1;
        let currentConsecutive = 1;
        let largeGaps = 0;

        for (let i = 1; i < 6; i++) {
            const diff = parseInt(sortedCombination[i]) - parseInt(sortedCombination[i - 1]);
            if (diff === 1) {
                currentConsecutive++;
                if (currentConsecutive > maxConsecutive) maxConsecutive = currentConsecutive;
            } else {
                currentConsecutive = 1;
            }
            if (diff > 5) largeGaps++;
        }

        if (maxConsecutive > 2) penalties += 8;
        if (largeGaps < 2) penalties += 4;

        // If perfect, return immediately
        if (penalties === 0) {
            const resultNumbers = sortedCombination.filter(x => x !== num);
            return { error: '', numbers: resultNumbers };
        }

        // Keep track of the best one found just in case
        if (bestScore === -1 || penalties < bestScore) {
            bestScore = penalties;
            bestSet = sortedCombination;
        }

        // If taking too long, start accepting slightly imperfect sets early to avoid browser freeze
        // Relaxing after 500k iterations
        if (iter > 500000 && penalties <= 4) {
            const resultNumbers = sortedCombination.filter(x => x !== num);
            return { error: '', numbers: resultNumbers };
        }
    }

    // Fallback: Return best found set
    const fallbackNumbers = bestSet.filter(x => x !== num);
    return { error: '', numbers: fallbackNumbers };
}
