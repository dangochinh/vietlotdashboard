# Spec: Dashboard Page & Components

## Overview

Trang chính `/` là dashboard thống kê xổ số. Dữ liệu được tính toán client-side bằng `useMemo` từ raw data trả về từ API.

---

## State Management (`page.js`)

| State | Type | Mô tả |
|---|---|---|
| `activeTab` | `'Mega645' \| 'Power655'` | Loại xổ số đang xem |
| `infoModalOpen` | `boolean` | Toggle modal giới thiệu |
| `viewAllModal` | `{ open, title, type }` | Toggle modal xem đầy đủ |

---

## Data Hooks

### `useVietlottData(activeTab)`

- Fetch từ `/api/vietlott?type=${activeTab}` (SWR)
- Fetch từ `/api/jackpot?type=${activeTab}` (SWR)
- Cache: 5 phút, `revalidateOnFocus: false`
- Format `lastUpdated`: chuyển `YYYY-MM-DD HH:mm:ss` → `HH:mm:ss DD/MM/YYYY`
- Return: `{ data, loading, error, jackpotData, lastUpdated }`

### `useCountdown(activeTab)`

- Dựa trên `DRAW_DAYS` và `DRAW_HOUR` từ constants
- Mega 6/45: drawDays = `[3, 5, 0]` (Thứ 4, Thứ 6, Chủ Nhật)
- Power 6/55: drawDays = `[2, 4, 6]` (Thứ 3, Thứ 5, Thứ 7)
- Giờ quay: 18:00 VNT
- Return: countdown string `HH:MM:SS`

---

## Computed Data (useMemo)

### `frequencyData`

- Đếm số lần xuất hiện của từng số (01 đến max)
- Power 6/55: tính thêm `Số Đặc Biệt`
- Return: `{ top15, full, sequential }`
  - `top15`: sort by frequency desc, top 15
  - `full`: sort by frequency desc, tất cả
  - `sequential`: sort by number value asc, tất cả

### `pairData` & `trioData`

- Duyệt từng kỳ, tạo tất cả cặp C(6,2) và bộ ba C(6,3)
- Count thứ tự xuất hiện với key dạng `"07 - 22"` hoặc `"07 - 22 - 38"`
- Return: `{ pairData[:15], trioData[:15], pairDataFull, trioDataFull }`

### `coldNumbersData`

- Với mỗi số: tìm kỳ gần nhất số đó xuất hiện
- `drawsAbsent`: số kỳ vắng mặt (0 = xuất hiện kỳ mới nhất)
- Số chưa bao giờ xuất hiện: `drawsAbsent = data.length`
- Return: `{ top15, full }` — sort by drawsAbsent desc

### `evenOddData`

- Với mỗi kỳ: đếm số chẵn và lẻ trong 6 số chính
- Group thành 7 bucket: `"6 Chẵn - 0 Lẻ"` đến `"0 Chẵn - 6 Lẻ"`
- Return: array `[{ name, value }]` chỉ với bucket count > 0

### `sumData`

- 100 kỳ gần nhất, reversed (cũ nhất trước)
- Mỗi điểm: `{ drawId, index, sum }` (sum = tổng 6 số chính)

---

## Page Layout

```
<div className="min-h-screen bg-[#0E1217] p-6">
  <div className="max-w-7xl mx-auto space-y-8">
    <Header />

    [loading] → Loader2 spinner
    [error]   → AlertCircle red box
    [empty]   → "Chưa có dữ liệu" message
    [data]    →
      <JackpotCard />
      <AdBanner position="top" />
      
      <grid 2cols>
        <FrequencyChart />
        <HistoryTable />
      </grid>
      
      <FullFrequencyChart />
      
      <grid 2cols>
        <PairsChart />
        <TriosChart />
      </grid>
      
      <AdBanner position="mid" />
      
      <grid 2cols>
        <ColdNumbersChart />
        <EvenOddPie />
      </grid>
      <SumScatter />
      
      <AdBanner position="bottom" />
      
      <ViewAllModal />
      <InfoModal />
  </div>
</div>
```

---

## Component Specs

### `Header`

**Props**: `{ activeTab, setActiveTab, lastUpdated, onInfoOpen }`

- Sticky top, z-50, glassmorphism
- Game tab toggle: Mega 6/45 | Power 6/55
- Buttons: "Giới Thiệu" (onInfoOpen) | Link `/predict` "Dự Đoán"
- Mobile: flex-col, buttons full-width

---

### `JackpotCard`

**Props**: `{ activeTab, jackpotData, countdown }`

- Hiển thị jackpot1 (và jackpot2 nếu Power655)
- Countdown timer đến kỳ quay tiếp theo
- Khi jackpot = null: skeleton hoặc "Đang tải..."

---

### `FrequencyChart`

**Props**: `{ data: frequencyData, onViewAll }`

- Hiển thị `data.top15`
- Nút "Xem Tất Cả" → `onViewAll({ open: true, title: 'Tần Suất', type: 'frequency' })`
- Recharts `BarChart` layout="vertical", responsive
- Color: top bar `#10b981`, rest `#0d9488`

---

### `HistoryTable`

**Props**: `{ data, activeTab }`

- Hiển thị 10 kỳ mới nhất (`data.slice(0, 10)`)
- Render `Ball` component cho mỗi số
- Power655: hiển thị cột "Số ĐB" riêng

---

### `FullFrequencyChart`

**Props**: `{ data: frequencyData }`

- Hiển thị `data.sequential` (tất cả số theo thứ tự)
- Nút fullscreen mở overlay modal
- Trong fullscreen modal: layout dọc, labels phía trên bars

---

### `PairsChart`

**Props**: `{ data: pairData, onViewAll }`

- Top 15 cặp số, recharts BarChart
- "Xem Tất Cả" → `type: 'pairs'`

---

### `TriosChart`

**Props**: `{ data: trioData, onViewAll }`

- Top 15 bộ ba số, recharts BarChart
- "Xem Tất Cả" → `type: 'trios'`

---

### `ColdNumbersChart`

**Props**: `{ data: coldNumbersData, onViewAll }`

- Top 15 số vắng mặt lâu nhất
- X-axis label: "Số kỳ vắng"
- "Xem Tất Cả" → `type: 'cold'`

---

### `EvenOddPie`

**Props**: `{ data: evenOddData }`

- PieChart với 7 màu từ `CHART_COLORS.evenOdd`
- Label hiển thị tên bucket và %

---

### `SumScatter`

**Props**: `{ data: sumData, activeTab }`

- ScatterChart, X: index kỳ quay, Y: tổng giá trị
- Reference line tại `EXPECTED_SUM[activeTab]` (dash style)
- Dots màu fuchsia

---

### `ViewAllModal`

**Props**: `{ viewAllModal, onClose, frequencyData, pairDataFull, trioDataFull, coldNumbersData }`

- Fullscreen overlay
- Pinned header với tiêu đề + nút đóng `✕`
- 4 tabs: Tần Suất / Lạnh / Cặp Số / Bộ Ba
- Render full list tương ứng với `type` từ state

---

### `InfoModal`

**Props**: `{ isOpen, onClose }`

- Centered modal (không fullscreen)
- Header pinned: title + close button
- Nội dung: giới thiệu Vietlott, thông tin công ty, sản phẩm

---

### `AdBanner`

**Props**: `{ position: 'top' | 'mid' | 'bottom', className? }`

- Render `<ins class="adsbygoogle">` với `data-ad-slot` tương ứng
- Publisher ID: `ca-pub-9806354177150523`
- `useEffect` để gọi `adsbygoogle.push({})`
- Ẩn nếu process.env.NODE_ENV !== 'production' (tùy cấu hình)

---

### `Ball`

**Props**: `{ num: string }`

- Vòng tròn `w-12 h-12 rounded-full`
- Theme: số > 40 → red, số ≤ 40 → blue
- Hiển thị `num` (2 chữ số, zero-padded)

---

## Constants (`lib/constants.js`)

```js
DRAW_DAYS = { Mega645: [3, 5, 0], Power655: [2, 4, 6] }
DRAW_HOUR = 18

CHART_COLORS = {
  frequency: { top: '#10b981', rest: '#0d9488' },
  pairs:     { top: '#818cf8', rest: '#6366f1' },
  trios:     { top: '#fb7185', rest: '#f43f5e' },
  cold:      { top: '#3b82f6', rest: '#2563eb' },
  evenOdd:   ['#f97316', '#eab308', '#84cc16', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6'],
  scatter:   '#c026d3',
}

MAX_NUMBERS = { Mega645: 45, Power655: 55 }
EXPECTED_SUM = { Mega645: 138, Power655: 168 }

TOOLTIP_STYLE = { contentStyle: { backgroundColor: '#1f2937', border: 'none', borderRadius: '12px' } }
```
