import { isValidTicket, uniqueTicketKey } from './ticketValidation.mjs';

export const GAMES = { Mega645: 45, Power655: 55 };

/** Bias-free random integer in [0,max); browser or Node Web Crypto. */
export function secureInt(max) {
  if (!Number.isSafeInteger(max) || max <= 0) throw new RangeError('Invalid random range');
  const range = 0x100000000;
  const limit = range - range % max;
  const arr = new Uint32Array(1);
  let n;
  do {
    globalThis.crypto.getRandomValues(arr);
    n = arr[0];
  } while (n >= limit);
  return n % max;
}

export function normalizeSeeds(raw, game) {
  const max = GAMES[game];
  if (!max) return { error: 'Loại vé không hợp lệ', seeds: [] };
  const input = String(raw || '').trim();
  if (input && !/^(?:\d{1,2})(?:\s+\d{1,2}){0,2}$/.test(input)) {
    return { error: 'Chỉ nhập tối đa 3 số, cách nhau bằng dấu cách', seeds: [] };
  }
  const seeds = input ? input.split(/\s+/).map(n => n.padStart(2,'0')) : [];
  if (new Set(seeds).size !== seeds.length) return { error: 'Vui lòng không nhập các số trùng nhau', seeds: [] };
  if (seeds.some(n => +n < 1 || +n > max)) return { error: 'Số phải nằm trong khoảng 01–' + max, seeds: [] };
  return { seeds, error: '' };
}

/**
 * Create 1–5 independent valid combinations.
 * random: independently samples 6-number combinations (conditional on favorites).
 * coverage: reduces duplication of non-favorite numbers across the selected tickets.
 * Neither method predicts future drawings or improves any particular combination's odds.
 */
export function generateTicketSet({ game = 'Mega645', seeds = [], count = 5, mode = 'coverage', existing = [], rng = secureInt } = {}) {
  const max = GAMES[game];
  if (!max || !Number.isInteger(count) || count < 1 || count > 5 || !['coverage','random'].includes(mode)) {
    throw new Error('Tùy chọn tạo vé không hợp lệ');
  }
  if (!Array.isArray(seeds) || seeds.length > 3 || new Set(seeds).size !== seeds.length ||
      seeds.some(n => typeof n !== 'string' || !/^\d{2}$/.test(n) || +n < 1 || +n > max)) {
    throw new Error('Số yêu thích không hợp lệ');
  }
  const usage = new Map();
  const excludedKeys = new Set();
  const result = [];
  const validExisting = existing.filter(t => isValidTicket(t, [], max));
  for (const ticket of validExisting) {
    excludedKeys.add(uniqueTicketKey(ticket));
    for (const n of ticket) usage.set(n, (usage.get(n) || 0) + 1);
  }
  for (let index = 0; index < count; index++) {
    let ticket;
    let attempt = 0;
    do {
      const numbers = [...seeds];
      while (numbers.length < 6) {
        const eligible = [];
        for (let n = 1; n <= max; n++) {
          const padded = String(n).padStart(2, '0');
          if (!numbers.includes(padded)) eligible.push(padded);
        }
        let pool = eligible;
        if (mode === 'coverage') {
          const minimum = Math.min(...eligible.map(n => usage.get(n) || 0));
          pool = eligible.filter(n => (usage.get(n) || 0) === minimum);
        }
        numbers.push(pool[rng(pool.length)]);
      }
      ticket = numbers.sort((a,b) => +a - +b);
      attempt++;
    } while (excludedKeys.has(uniqueTicketKey(ticket)) && attempt < 100);
    if (!isValidTicket(ticket, seeds, max) || excludedKeys.has(uniqueTicketKey(ticket))) {
      throw new Error('Không thể sinh thêm vé không trùng, hãy thử lại');
    }
    result.push(ticket);
    excludedKeys.add(uniqueTicketKey(ticket));
    ticket.forEach(n => usage.set(n,(usage.get(n)||0) + 1));
  }
  return result;
}

export function summarizeTickets(tickets, game) {
  const max = GAMES[game] || 45;
  const valid = tickets.filter(t => isValidTicket(t, [], max));
  const distinct = new Set(valid.flat());
  return { count: valid.length, distinct: distinct.size, maximum: max, ratio: Math.round(distinct.size / max * 100) };
}
