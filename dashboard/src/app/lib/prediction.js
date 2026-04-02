import { MAX_NUMBERS } from './constants';

function mulberry32(a) {
    return function () {
        var t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}


// ---- ALGORITHM 1: CO-OCCURRENCE (DEFAULT) ----
export function predictByCoOccurrence(inputArray, targetCount, activeTab, data, excludeNumbers = [], offsetIndex = 0) {
    const maxNum = MAX_NUMBERS[activeTab];

    if (!inputArray || inputArray.length === 0) {
        return { error: `Vui lòng nhập ít nhất 1 số`, numbers: [] };
    }

    const relevantDraws = data.filter(row => {
        for (let i = 1; i <= 6; i++) {
            if (inputArray.includes(row[`Số ${i}`])) return true;
        }
        return false;
    });

    if (relevantDraws.length === 0 && offsetIndex === 0) {
        return { error: 'Chưa có lịch sử đủ dài cho các số này.', numbers: [] };
    }

    const counts = {};
    if (relevantDraws.length > 0) {
        relevantDraws.forEach(row => {
            for (let i = 1; i <= 6; i++) {
                const val = row[`Số ${i}`];
                if (val && !inputArray.includes(val) && !excludeNumbers.includes(val)) {
                    counts[val] = (counts[val] || 0) + 1;
                }
            }
        });
    }

    const skip = offsetIndex * targetCount;
    const sortedKeys = Object.keys(counts).filter(k => counts[k] > 0).sort((a, b) => counts[b] - counts[a]);
    const topChoices = sortedKeys.slice(skip, skip + targetCount);

    if (topChoices.length < targetCount) {
        // Fallback: fill with top overall frequencies that are not in excluded/input
        const fallbackCounts = {};
        data.forEach(row => {
            for (let i = 1; i <= 6; i++) {
                const val = row[`Số ${i}`];
                if (val && !inputArray.includes(val) && !excludeNumbers.includes(val) && !topChoices.includes(val)) {
                    fallbackCounts[val] = (fallbackCounts[val] || 0) + 1;
                }
            }
        });
        const additionalSkip = Math.max(0, skip - sortedKeys.length);
        const additional = Object.keys(fallbackCounts)
            .sort((a, b) => fallbackCounts[b] - fallbackCounts[a])
            .slice(additionalSkip, additionalSkip + targetCount - topChoices.length);
        topChoices.push(...additional);
    }

    return { error: '', numbers: topChoices.sort((a, b) => parseInt(a) - parseInt(b)) };
}

// ---- ALGORITHM 2: 4-LAYER FILTERING ----
export function predictBy4LayerFiltering(inputArray, targetCount, activeTab, data, clientId = '', excludeNumbers = [], attemptOffset = 0) {
    const maxNum = MAX_NUMBERS[activeTab];

    if (!inputArray || inputArray.length === 0) {
        return { error: `Vui lòng nhập ít nhất 1 số`, numbers: [] };
    }

    if (!data || data.length < 50) {
        return { error: 'Cần ít nhất 50 kỳ lịch sử để phân tích Layer 4.', numbers: [] };
    }

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
    const hotNumbers = frequencyList.slice(0, 15).map(i => i.num);
    const coldNumbers = frequencyList.slice(-15).map(i => i.num);

    const MIN_SUM = activeTab === 'Mega645' ? 110 : 130;
    const MAX_SUM = activeTab === 'Mega645' ? 160 : 180;
    const HIGH_THRESHOLD = activeTab === 'Mega645' ? 22 : 27;

    let clientHash = 0;
    for (let i = 0; i < clientId.length; i++) {
        clientHash = (clientHash << 5) - clientHash + clientId.charCodeAt(i);
        clientHash |= 0;
    }

    const latestDrawId = data[0]['Kỳ QSMT'] ? parseInt(data[0]['Kỳ QSMT'].replace(/\D/g, '')) || data.length : data.length;
    
    // Seed incorporates attemptOffset to ensure re-rolls don't just generate the exact same ticket
    const baseSeedNum = inputArray.length > 0 ? parseInt(inputArray[0]) : 1;
    const seed = baseSeedNum * 100000 + latestDrawId + Math.abs(clientHash) + attemptOffset;
    const rng = mulberry32(seed);

    const pickRandomSet = (arr, count, exclude = []) => {
        const available = arr.filter(x => !exclude.includes(x));
        const result = [];
        for (let i = 0; i < count; i++) {
            if (available.length === 0) break;
            const idx = Math.floor(rng() * available.length);
            result.push(available[idx]);
            available.splice(idx, 1);
        }
        return result;
    };

    const MAX_ITERATIONS = 1000000;
    let bestSet = null;
    let bestScore = -1;
    
    const combinedExclude = [...inputArray, ...excludeNumbers];

    for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
        const candidateSet = new Set(inputArray);
        const currentExcludedForThisIter = new Set(combinedExclude);

        const lDraw = pickRandomSet(lastDraw, 1, Array.from(currentExcludedForThisIter));
        if (lDraw.length) {
            candidateSet.add(lDraw[0]);
            currentExcludedForThisIter.add(lDraw[0]);
        }

        const cNum = pickRandomSet(coldNumbers, 1, Array.from(currentExcludedForThisIter));
        if (cNum.length) {
            candidateSet.add(cNum[0]);
            currentExcludedForThisIter.add(cNum[0]);
        }

        const hNums = pickRandomSet(hotNumbers, 6 - candidateSet.size, Array.from(currentExcludedForThisIter));
        hNums.forEach(n => {
            candidateSet.add(n);
            currentExcludedForThisIter.add(n);
        });

        let safetyCounter = 0;
        while (candidateSet.size < 6 && safetyCounter < 100) {
            const rand = Math.floor(rng() * maxNum) + 1;
            const s = rand.toString().padStart(2, '0');
            if (!currentExcludedForThisIter.has(s)) {
                candidateSet.add(s);
                currentExcludedForThisIter.add(s);
            }
            safetyCounter++;
        }

        const sortedCombination = Array.from(candidateSet).sort((a, b) => parseInt(a) - parseInt(b));
        let penalties = 0;

        const sum = sortedCombination.reduce((acc, val) => acc + parseInt(val), 0);
        if (sum < MIN_SUM || sum > MAX_SUM) penalties += 10;

        let evens = 0;
        let lows = 0;
        sortedCombination.forEach(val => {
            const n = parseInt(val);
            if (n % 2 === 0) evens++;
            if (n <= HIGH_THRESHOLD) lows++;
        });
        if (evens === 0 || evens === 1 || evens === 5 || evens === 6) penalties += 5;
        if (lows === 0 || lows === 1 || lows === 5 || lows === 6) penalties += 5;

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

        if (penalties === 0) {
            const resultNumbers = sortedCombination.filter(x => !inputArray.includes(x));
            return { error: '', numbers: resultNumbers };
        }

        if (bestScore === -1 || penalties < bestScore) {
            bestScore = penalties;
            bestSet = sortedCombination;
        }

        if (iter > 500000 && penalties <= 4) {
            const resultNumbers = sortedCombination.filter(x => !inputArray.includes(x));
            return { error: '', numbers: resultNumbers };
        }
    }

    const fallbackNumbers = bestSet.filter(x => !inputArray.includes(x));
    return { error: '', numbers: fallbackNumbers };
}
