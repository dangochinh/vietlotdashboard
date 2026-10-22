/** Pure ticket invariants shared by generation and automated tests. */
export function validateSeeds(seeds, maxNum, targetCount) {
  if (!Number.isInteger(maxNum) || maxNum < 6) return 'Loại vé không hợp lệ';
  if (!Array.isArray(seeds) || seeds.length < 1 || seeds.length > 3) return 'Vui lòng nhập từ 1 đến 3 số';
  if (new Set(seeds).size !== seeds.length) return 'Vui lòng không nhập các số trùng nhau';
  if (seeds.some(n => !/^\d{2}$/.test(n) || +n < 1 || +n > maxNum))
    return `Vui lòng nhập số từ 01 đến ${maxNum}`;
  if (targetCount !== 6 - seeds.length) return 'Số lượng cần sinh không hợp lệ';
  return '';
}

export function isValidTicket(ticket, seeds, maxNum) {
  return Array.isArray(ticket) && ticket.length === 6
    && new Set(ticket).size === 6
    && ticket.every(n => /^\d{2}$/.test(n) && +n >= 1 && +n <= maxNum)
    && seeds.every(n => ticket.includes(n));
}

export function uniqueTicketKey(ticket) { return [...ticket].sort((a,b) => +a - +b).join('-'); }
