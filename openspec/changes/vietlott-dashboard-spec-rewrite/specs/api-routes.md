# Spec: API Routes

## Mục Đích

Cung cấp dữ liệu xổ số cho frontend thông qua Next.js Route Handlers.

---

## Routes

### `GET /api/vietlott`

**File**: `dashboard/src/app/api/vietlott/route.js`

**Chức năng**: Lấy toàn bộ lịch sử xổ số từ Google Sheets.

#### Query Parameters

| Param | Type | Default | Giá trị hợp lệ |
|---|---|---|---|
| `type` | string | `Mega645` | `Mega645`, `Power655` |

#### Authentication

1. Ưu tiên biến env `GOOGLE_CREDENTIALS` (JSON string)
2. Fallback: file `../scraper/credentials.json`
3. Scope: `https://www.googleapis.com/auth/spreadsheets.readonly`

#### Data Processing

1. Đọc `{type}!A:I` từ Google Sheets
2. Hàng đầu tiên: kiểm tra headers (tự động detect)
3. Map mỗi hàng thành object với keys: `Kỳ QSMT / Ngày`, `Số 1` → `Số 6`, `Số Đặc Biệt`, `Ngày Cào`
4. `data.reverse()` — trả về mới nhất trước

#### Response Success

```json
{
  "success": true,
  "data": [
    {
      "Kỳ QSMT / Ngày": "Kỳ 01492 | 03/04/2026",
      "Số 1": "07",
      "Số 2": "14",
      "Số 3": "22",
      "Số 4": "30",
      "Số 5": "38",
      "Số 6": "44",
      "Số Đặc Biệt": "",
      "Ngày Cào": "2026-04-03 19:45:12"
    },
    ...
  ]
}
```

#### Response Error

```json
{
  "success": false,
  "error": "Failed to fetch lottery data. Please try again later."
}
```

**Status code lỗi**: 500

#### Cache Behavior

- `export const dynamic = 'force-dynamic'`  (không cache server-side)
- Client SWR cache: 5 phút (`dedupingInterval: 300000`)

---

### `GET /api/jackpot`

**File**: `dashboard/src/app/api/jackpot/route.js`

**Chức năng**: Scrape realtime giá trị jackpot từ `minhngoc.net.vn`.

#### Query Parameters

| Param | Type | Default | Giá trị hợp lệ |
|---|---|---|---|
| `type` | string | `Mega645` | `Mega645`, `Power655` |

#### Target URLs

| Type | URL |
|---|---|
| `Mega645` | `https://www.minhngoc.net.vn/ket-qua-xo-so/dien-toan-vietlott/mega-6x45.html` |
| `Power655` | `https://www.minhngoc.net.vn/ket-qua-xo-so/dien-toan-vietlott/power-6x55.html` |

#### Parsing Logic

**Mega 6/45**:
- Element: `[id*="DT6X45_G_JACKPOT"]` (first match)
- Extract value bằng regex `/[0-9.,]{8,}/` → replace `,` với `.`

**Power 6/55**:
- JP1: `[id*="DT6X55_G_JACKPOT"]` không có "JACKPOT2"
- JP2: `[id*="DT6X55_G_JACKPOT2"]`

#### Response Success

```json
// Mega645
{ "success": true, "data": { "jackpot1": "45.000.000.000", "jackpot2": null } }

// Power655
{ "success": true, "data": { "jackpot1": "45.000.000.000", "jackpot2": "1.000.000.000" } }
```

#### Response Error

```json
{ "success": false, "error": "Could not parse Jackpot value" }
```

#### Cache

```js
next: { revalidate: 300 } // Next.js cache 5 phút
```

---

## Environment Variables (Dashboard)

| Variable | Mô tả | Fallback |
|---|---|---|
| `GOOGLE_CREDENTIALS` | JSON string Service Account | File `../scraper/credentials.json` |
| `GOOGLE_SHEET_ID` | ID của Google Spreadsheet | Hardcoded `1rkURU2bHuhgtf1k5uIzfG7sH8vQQ0VyaSra6M9WTo18` |
