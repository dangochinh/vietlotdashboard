import { MAX_NUMBERS } from './constants';

// ============================================================
// COVERAGE MAXIMIZER ALGORITHM
// Mục tiêu: Tối đa hóa xác suất trúng Giải 3 (3/6) và Giải Nhì (4/6)
//
// Chiến lược:
//   - Core Set: 2-3 số hot nhất overlap giữa các vé → nếu core trúng,
//     nhiều vé cùng hưởng → tối ưu cho 4/6
//   - Spread Numbers: phân phối tối đa unique numbers trên 5 vé
//     → coverage 22-28/45 số → tối ưu cho 3/6
//   - Relaxed constraints: chỉ loại bỏ bộ số cực đoan
// ============================================================

function mulberry32(a) {
    return function () {
        var t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

function shuffleArray(arr, rng) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Build weighted frequency pool from historical data.
 * Returns { hot, warm, cold, allWeighted, coOccurrence }
 */
function buildFrequencyPool(data, maxNum, inputArray) {
    const recentCount = Math.min(50, data.length);
    const midCount = Math.min(150, data.length);

    // Frequency in recent 50 draws
    const recentFreq = {};
    for (let i = 1; i <= maxNum; i++) recentFreq[i.toString().padStart(2, '0')] = 0;

    for (let d = 0; d < recentCount; d++) {
        for (let i = 1; i <= 6; i++) {
            const val = data[d][`Số ${i}`];
            if (val) recentFreq[val] = (recentFreq[val] || 0) + 1;
        }
    }

    // Frequency in draws 50-150 (warm zone)
    const warmFreq = {};
    for (let i = 1; i <= maxNum; i++) warmFreq[i.toString().padStart(2, '0')] = 0;

    for (let d = recentCount; d < midCount; d++) {
        for (let i = 1; i <= 6; i++) {
            const val = data[d][`Số ${i}`];
            if (val) warmFreq[val] = (warmFreq[val] || 0) + 1;
        }
    }

    // Combined weighted score: recent x3 + warm x1
    const weightedScores = {};
    for (let i = 1; i <= maxNum; i++) {
        const key = i.toString().padStart(2, '0');
        weightedScores[key] = (recentFreq[key] || 0) * 3 + (warmFreq[key] || 0);
    }

    // Sort by weighted score
    const sorted = Object.entries(weightedScores)
        .sort((a, b) => b[1] - a[1])
        .map(e => e[0]);

    const hot = sorted.slice(0, 18);   // Top 18 — expanded pool for spread
    const warm = sorted.slice(18, 30); // Next 12
    const cold = sorted.slice(-10);    // Bottom 10

    // Co-occurrence with input numbers
    const coOccur = {};
    if (inputArray.length > 0) {
        data.forEach(row => {
            const drawNums = [];
            for (let i = 1; i <= 6; i++) {
                if (row[`Số ${i}`]) drawNums.push(row[`Số ${i}`]);
            }
            const hasInput = inputArray.some(n => drawNums.includes(n));
            if (hasInput) {
                drawNums.forEach(n => {
                    if (!inputArray.includes(n)) {
                        coOccur[n] = (coOccur[n] || 0) + 1;
                    }
                });
            }
        });
    }

    return { hot, warm, cold, weightedScores, coOccurrence: coOccur, recentFreq };
}

/**
 * Build the core set — numbers that appear in EVERY ticket.
 * Core = user input + top co-occurring hot numbers (total 2-3 nums)
 */
function buildCoreSet(inputArray, pool, maxCoreSize = 3) {
    const core = [...inputArray];

    // Add top co-occurring numbers that are also hot
    const coOccurSorted = Object.entries(pool.coOccurrence)
        .filter(([num]) => pool.hot.includes(num) && !core.includes(num))
        .sort((a, b) => b[1] - a[1]);

    for (const [num] of coOccurSorted) {
        if (core.length >= maxCoreSize) break;
        core.push(num);
    }

    // If still not enough, add top hot numbers
    if (core.length < 2) {
        for (const num of pool.hot) {
            if (core.length >= 2) break;
            if (!core.includes(num)) core.push(num);
        }
    }

    return core;
}

/**
 * Light validation — much softer than old 4-layer.
 * Only rejects truly extreme combinations.
 */
function lightValidate(ticket, maxNum) {
    const nums = ticket.map(n => parseInt(n));
    const sum = nums.reduce((a, b) => a + b, 0);

    // Very loose sum bounds
    const minSum = maxNum <= 45 ? 70 : 85;
    const maxSum = maxNum <= 45 ? 200 : 240;
    if (sum < minSum || sum > maxSum) return false;

    // Reject all-even or all-odd
    const evens = nums.filter(n => n % 2 === 0).length;
    if (evens === 0 || evens === 6) return false;

    // Reject 4+ consecutive numbers
    const sorted = [...nums].sort((a, b) => a - b);
    let maxConsec = 1, curConsec = 1;
    for (let i = 1; i < sorted.length; i++) {
        if (sorted[i] - sorted[i - 1] === 1) {
            curConsec++;
            if (curConsec > maxConsec) maxConsec = curConsec;
        } else {
            curConsec = 1;
        }
    }
    if (maxConsec >= 4) return false;

    return true;
}

/**
 * Generate 5 tickets simultaneously using Coverage Maximizer strategy.
 *
 * Architecture:
 *   - Core = user input ONLY (shared across all 5 tickets)
 *   - Semi-core = top 3 hot co-occurring numbers, each appears in 2 tickets
 *   - Spread = remaining numbers, each appears in exactly 1 ticket
 *   - Target: 25-30 unique numbers across 5 tickets
 *
 * @param {string[]} inputArray - User's seed numbers (1-3 numbers, padded "01"-"45"/"55")
 * @param {number} targetCount - How many numbers to generate per ticket (6 - inputArray.length)
 * @param {string} activeTab - 'Mega645' or 'Power655'
 * @param {object[]} data - Historical draw data, newest first
 * @param {string} clientId - Unique client identifier
 * @param {number} attemptOffset - Offset for re-rolls
 * @returns {{ error: string, tickets: string[][] }} - 5 tickets, each with only the GENERATED numbers (excluding input)
 */
export function predictCoverageMulti(inputArray, targetCount, activeTab, data, clientId = '', attemptOffset = 0) {
    const maxNum = MAX_NUMBERS[activeTab];

    if (!inputArray || inputArray.length === 0) {
        return { error: 'Vui lòng nhập ít nhất 1 số', tickets: [] };
    }

    if (!data || data.length < 30) {
        return { error: 'Cần ít nhất 30 kỳ lịch sử để phân tích.', tickets: [] };
    }

    // Seed RNG
    let clientHash = 0;
    for (let i = 0; i < clientId.length; i++) {
        clientHash = (clientHash << 5) - clientHash + clientId.charCodeAt(i);
        clientHash |= 0;
    }
    const baseSeed = (parseInt(inputArray[0]) || 1) * 100000 +
        data.length + Math.abs(clientHash) + attemptOffset;
    const rng = mulberry32(baseSeed);

    // Step 1: Build frequency pool
    const pool = buildFrequencyPool(data, maxNum, inputArray);

    // Step 2: Core = user input only (appears in ALL 5 tickets)
    const coreSet = [...inputArray];

    // Step 3: Build ranked candidate pool (excluding user input)
    // Combine co-occurrence scores with frequency scores
    const candidateScores = {};
    for (let i = 1; i <= maxNum; i++) {
        const s = i.toString().padStart(2, '0');
        if (coreSet.includes(s)) continue;
        const freqScore = (pool.weightedScores[s] || 0);
        const coScore = (pool.coOccurrence[s] || 0) * 2;
        candidateScores[s] = freqScore + coScore;
    }

    const rankedCandidates = Object.entries(candidateScores)
        .sort((a, b) => b[1] - a[1])
        .map(e => e[0]);

    // Step 4: Semi-core numbers — top 3 candidates appear in 2 tickets each
    // This helps Prize 2 (4/6): if semi-core numbers hit, 2 tickets benefit
    const semiCore = rankedCandidates.slice(0, 3);
    const spreadCandidates = rankedCandidates.slice(3);

    const TICKET_COUNT = 5;
    const slotsPerTicket = 6 - coreSet.length;

    // Initialize tickets with core (user input)
    const tickets = Array.from({ length: TICKET_COUNT }, () => [...coreSet]);
    const usedByTicket = tickets.map(() => new Set(coreSet));

    // Assign semi-core: each semi-core number goes to exactly 2 tickets
    // Ticket pairs: (0,1), (2,3), (1,4) — each ticket gets ~1 semi-core number
    const semiCorePairs = [[0, 1], [2, 3], [1, 4]];
    for (let sc = 0; sc < semiCore.length && sc < semiCorePairs.length; sc++) {
        const num = semiCore[sc];
        for (const tIdx of semiCorePairs[sc]) {
            if (tickets[tIdx].length < 6 && !usedByTicket[tIdx].has(num)) {
                tickets[tIdx].push(num);
                usedByTicket[tIdx].add(num);
            }
        }
    }

    // Step 5: Distribute spread candidates — each goes to exactly 1 ticket (round-robin)
    // This maximizes unique coverage
    let spreadIdx = 0;
    const shuffledSpread = shuffleArray(spreadCandidates, rng);

    // Round-robin: fill tickets that have the most empty slots first
    while (spreadIdx < shuffledSpread.length) {
        // Find ticket with most empty slots
        let bestT = -1;
        let bestEmpty = 0;
        for (let t = 0; t < TICKET_COUNT; t++) {
            const empty = 6 - tickets[t].length;
            if (empty > bestEmpty) {
                bestEmpty = empty;
                bestT = t;
            }
        }

        if (bestT === -1 || bestEmpty === 0) break; // All full

        const num = shuffledSpread[spreadIdx];
        spreadIdx++;

        if (!usedByTicket[bestT].has(num)) {
            tickets[bestT].push(num);
            usedByTicket[bestT].add(num);
        }
    }

    // Fill any remaining slots with weighted random (shouldn't happen often)
    const allUsedGlobal = new Set();
    tickets.forEach(t => t.forEach(n => allUsedGlobal.add(n)));

    for (let t = 0; t < TICKET_COUNT; t++) {
        let safety = 0;
        while (tickets[t].length < 6 && safety < 200) {
            const candidates = [];
            for (let i = 1; i <= maxNum; i++) {
                const s = i.toString().padStart(2, '0');
                if (!usedByTicket[t].has(s)) {
                    const weight = (pool.weightedScores[s] || 1) + 1;
                    const diversityBonus = allUsedGlobal.has(s) ? 0 : 5;
                    candidates.push({ num: s, weight: weight + diversityBonus });
                }
            }
            if (candidates.length === 0) break;

            const totalWeight = candidates.reduce((sum, c) => sum + c.weight, 0);
            let r = rng() * totalWeight;
            let chosen = candidates[0].num;
            for (const c of candidates) {
                r -= c.weight;
                if (r <= 0) { chosen = c.num; break; }
            }

            tickets[t].push(chosen);
            usedByTicket[t].add(chosen);
            allUsedGlobal.add(chosen);
            safety++;
        }
    }

    // Step 6: Validate & adjust each ticket (light validation)
    const finalTickets = [];
    for (let t = 0; t < TICKET_COUNT; t++) {
        let ticket = tickets[t].sort((a, b) => parseInt(a) - parseInt(b)).slice(0, 6);

        // Light validation — if fails, swap 1 non-input number
        if (!lightValidate(ticket, maxNum)) {
            let swapped = false;
            for (let attempt = 0; attempt < 50 && !swapped; attempt++) {
                const swappableIndices = [];
                for (let i = 0; i < ticket.length; i++) {
                    if (!inputArray.includes(ticket[i])) {
                        swappableIndices.push(i);
                    }
                }
                if (swappableIndices.length === 0) break;

                const swapIdx = swappableIndices[Math.floor(rng() * swappableIndices.length)];

                // Pick a replacement — prefer unused globally
                let repStr;
                for (let a = 0; a < 50; a++) {
                    const replacement = Math.floor(rng() * maxNum) + 1;
                    repStr = replacement.toString().padStart(2, '0');
                    if (!ticket.includes(repStr) && !allUsedGlobal.has(repStr)) break;
                    if (!ticket.includes(repStr)) break;
                }

                if (repStr && !ticket.includes(repStr)) {
                    const newTicket = [...ticket];
                    newTicket[swapIdx] = repStr;
                    newTicket.sort((a, b) => parseInt(a) - parseInt(b));
                    if (lightValidate(newTicket, maxNum)) {
                        ticket = newTicket;
                        swapped = true;
                    }
                }
            }
        }

        // Return only the generated numbers (exclude user input)
        const generated = ticket.filter(n => !inputArray.includes(n));
        finalTickets.push(generated);
    }

    return { error: '', tickets: finalTickets };
}

/**
 * Generate a SINGLE ticket using coverage-focused strategy.
 * Still targets Prize 3-2 by using weighted frequency + co-occurrence.
 *
 * @param {string[]} inputArray
 * @param {number} targetCount
 * @param {string} activeTab
 * @param {object[]} data
 * @param {string} clientId
 * @param {number} attemptOffset
 * @returns {{ error: string, numbers: string[] }}
 */
export function predictCoverageSingle(inputArray, targetCount, activeTab, data, clientId = '', attemptOffset = 0) {
    const maxNum = MAX_NUMBERS[activeTab];

    if (!inputArray || inputArray.length === 0) {
        return { error: 'Vui lòng nhập ít nhất 1 số', numbers: [] };
    }

    if (!data || data.length < 30) {
        return { error: 'Cần ít nhất 30 kỳ lịch sử để phân tích.', numbers: [] };
    }

    // Seed RNG
    let clientHash = 0;
    for (let i = 0; i < clientId.length; i++) {
        clientHash = (clientHash << 5) - clientHash + clientId.charCodeAt(i);
        clientHash |= 0;
    }
    const baseSeed = (parseInt(inputArray[0]) || 1) * 100000 +
        data.length + Math.abs(clientHash) + attemptOffset;
    const rng = mulberry32(baseSeed);

    const pool = buildFrequencyPool(data, maxNum, inputArray);

    // For single ticket: mix of top co-occurring + hot + 1 wild card
    const candidates = [];

    // Priority 1: co-occurring hot numbers
    const coHot = Object.entries(pool.coOccurrence)
        .filter(([n]) => !inputArray.includes(n) && pool.hot.includes(n))
        .sort((a, b) => b[1] - a[1])
        .map(e => e[0]);
    coHot.forEach(n => candidates.push({ num: n, weight: 5 }));

    // Priority 2: co-occurring warm numbers
    const coWarm = Object.entries(pool.coOccurrence)
        .filter(([n]) => !inputArray.includes(n) && pool.warm.includes(n))
        .sort((a, b) => b[1] - a[1])
        .map(e => e[0]);
    coWarm.forEach(n => { if (!candidates.find(c => c.num === n)) candidates.push({ num: n, weight: 3 }); });

    // Priority 3: remaining hot numbers
    pool.hot.forEach(n => {
        if (!inputArray.includes(n) && !candidates.find(c => c.num === n)) {
            candidates.push({ num: n, weight: 3 });
        }
    });

    // Priority 4: warm numbers
    pool.warm.forEach(n => {
        if (!inputArray.includes(n) && !candidates.find(c => c.num === n)) {
            candidates.push({ num: n, weight: 2 });
        }
    });

    // Priority 5: cold wildcard
    pool.cold.forEach(n => {
        if (!inputArray.includes(n) && !candidates.find(c => c.num === n)) {
            candidates.push({ num: n, weight: 1 });
        }
    });

    // Try up to 10000 times to build a valid ticket
    const MAX_TRIES = 10000;
    let bestTicket = null;
    let bestScore = -Infinity;

    for (let attempt = 0; attempt < MAX_TRIES; attempt++) {
        const ticket = [...inputArray];
        const used = new Set(inputArray);

        // Weighted random selection for remaining slots
        while (ticket.length < 6) {
            const available = candidates.filter(c => !used.has(c.num));
            if (available.length === 0) {
                // Fallback: any number
                let fallback;
                let safety = 0;
                do {
                    fallback = (Math.floor(rng() * maxNum) + 1).toString().padStart(2, '0');
                    safety++;
                } while (used.has(fallback) && safety < 100);
                if (!used.has(fallback)) {
                    ticket.push(fallback);
                    used.add(fallback);
                }
                continue;
            }

            const totalWeight = available.reduce((s, c) => s + c.weight, 0);
            let r = rng() * totalWeight;
            let chosen = available[0].num;
            for (const c of available) {
                r -= c.weight;
                if (r <= 0) { chosen = c.num; break; }
            }
            ticket.push(chosen);
            used.add(chosen);
        }

        ticket.sort((a, b) => parseInt(a) - parseInt(b));

        if (!lightValidate(ticket, maxNum)) continue;

        // Score this ticket: higher = better for Prize 2-3 strategy
        // Prefer tickets with good mix of hot + warm numbers
        let score = 0;
        for (const n of ticket) {
            if (inputArray.includes(n)) continue;
            score += (pool.weightedScores[n] || 0);
            if (pool.coOccurrence[n]) score += pool.coOccurrence[n] * 2;
        }

        // Slight penalty for too many from same tier (want diversity)
        const hotCount = ticket.filter(n => pool.hot.includes(n)).length;
        if (hotCount >= 5) score -= 5;
        if (hotCount <= 1) score -= 5;

        if (score > bestScore) {
            bestScore = score;
            bestTicket = ticket;
        }

        // Good enough — take it
        if (attempt > 100 && score > bestScore * 0.8) break;
    }

    if (!bestTicket) {
        return { error: 'Không thể tạo vé hợp lệ, thử lại.', numbers: [] };
    }

    const result = bestTicket.filter(n => !inputArray.includes(n));
    return { error: '', numbers: result };
}

/**
 * Calculate the unique coverage across multiple tickets.
 * @param {string[][]} tickets - Array of tickets (each ticket is array of all 6 numbers)
 * @param {number} maxNum - Max number (45 or 55)
 * @returns {{ uniqueCount: number, maxNum: number, percentage: number }}
 */
export function calculateCoverage(tickets, maxNum) {
    const allNums = new Set();
    tickets.forEach(t => t.forEach(n => allNums.add(n)));
    const uniqueCount = allNums.size;
    return {
        uniqueCount,
        maxNum,
        percentage: Math.round((uniqueCount / maxNum) * 100)
    };
}
