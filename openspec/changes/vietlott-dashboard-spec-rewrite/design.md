# Design Specification — Vietlott Dashboard

## Design System

### Color Palette

| Token | Value | Mô tả |
|---|---|---|
| `bg-primary` | `#0E1217` | Nền tổng thể (dark navy) |
| `bg-card` | `#111827` / `gray-900` | Nền card/panel |
| `bg-surface` | `#1f2937` / `gray-800` | Nền input, tooltip, surface |
| `accent-teal` | `#10b981` / `emerald-500` | Màu chính — frequency, active tabs |
| `accent-purple` | `#8b5cf6` / `violet-500` | Màu predict, pairs chart |
| `accent-rose` | `#f43f5e` / `rose-500` | Màu trios chart |
| `accent-blue` | `#3b82f6` / `blue-500` | Màu cold numbers chart |
| `accent-orange` | `#f97316` | Even/odd chart item 1 |
| `accent-fuchsia` | `#c026d3` | Scatter plot dots |
| `text-primary` | `#ffffff` | Chữ chính |
| `text-secondary` | `#9ca3af` / `gray-400` | Chữ phụ, label |
| `text-muted` | `#6b7280` / `gray-500` | Placeholder, hint |
| `border` | `#374151` / `gray-700` | Đường viền |

### Typography

- **Font chính**: Geist Sans (variable `--font-geist-sans`)
- **Font mono**: Geist Mono (variable `--font-geist-mono`) — dùng cho timestamp, draw ID
- **Font UI class**: `font-sans` trên `<body>`

### Spacing & Layout

- **Container max-width**: `max-w-7xl` (dashboard), `max-w-3xl` (predict page)
- **Page padding**: `p-6` (desktop)
- **Card spacing**: `space-y-8` giữa các section
- **Grid system**:
  - 2 columns: `grid-cols-1 lg:grid-cols-2 gap-8`
  - Stack mobile, side-by-side desktop

### Border Radius

- **Cards**: `rounded-xl` (12px) / `rounded-2xl` (16px)
- **Buttons**: `rounded-xl`
- **Input**: `rounded-xl`
- **Small elements**: `rounded-lg` (8px)

### Shadows & Effects

- **Card glow**: `shadow-2xl`
- **Teal glow**: `shadow-[0_0_20px_rgba(20,184,166,0.3)]`
- **Indigo glow**: `hover:shadow-indigo-500/30`
- **Glassmorphism header**: `bg-[#0E1217]/95 backdrop-blur-xl`
- **Tooltip bg**: `#1f2937` với `border: none`, `border-radius: 12px`

---

## Component Design Specs

### Header

**Layout**: Sticky top, z-50, full-width, glassmorphism background.
```
[Logo "Vietlott Analytics"] [Gradient teal-emerald title]
[Subtitle: "Real-time statistics..."]
[Last updated timestamp: emerald monospace badge]

[Tab toggle: Mega 6/45 | Power 6/55] [center, wfull on mobile]

[Giới Thiệu btn: gray-800/700]  [Dự Đoán link: purple→indigo gradient]
```

**Mobile behavior**: Tất cả elements stack thành `flex-col`, buttons full-width.

---

### JackpotCard

**Layout**: Card hiển thị nổi bật jackpot value + countdown timer.
- Jackpot value lớn, gradient teal-emerald, font-black
- Power 6/55: hiển thị Jackpot 1 + Jackpot 2 riêng biệt
- Countdown: HH:MM:SS, font-mono, nếu hết countdown hiển thị "Hôm nay có kết quả!"

---

### Charts (FrequencyChart, PairsChart, TriosChart, ColdNumbersChart)

**Layout**: Card `rounded-xl bg-gray-900 p-4 md:p-6`
**Header**: `<h2>` với icon, badge số phần tử, nút `Xem Tất Cả` (link sang ViewAllModal)
**Chart**: Recharts `BarChart` horizontal (`layout="vertical"`)
- Labels: Custom `renderCustomBarLabel` hiển thị value cuối thanh bar
- Tooltip: `TOOLTIP_STYLE` (dark bg, borderRadius 12px)

**Color coding**:
- Frequency: top bar `#10b981`, rest `#0d9488`
- Pairs: top `#818cf8`, rest `#6366f1`  
- Trios: top `#fb7185`, rest `#f43f5e`
- Cold: top `#3b82f6`, rest `#2563eb`

---

### FullFrequencyChart

**Layout**: Card full-width, với nút Fullscreen (mở modal overlay toàn màn hình).
**Chart**: Recharts `BarChart` vertical — tất cả số từ 01 đến max.
- Mobile: scroll ngang nếu cần
- In modal fullscreen: layout dọc, các số xếp đứng với label phía trên bar.

---

### HistoryTable

**Layout**: Card với bảng lịch sử 10 kỳ gần nhất.
- Columns: Kỳ, Date, các số (render bằng `Ball` component), Số ĐB (Power 6/55)
- Striped rows: `even:bg-gray-800/30`
- Mobile: horizontal scroll

---

### EvenOddPie

**Layout**: Recharts `PieChart` với legend.
- Palette 7 màu (`evenOdd` array từ constants)
- Label trên pie hiển thị %

---

### SumScatter

**Layout**: Recharts `ScatterChart` — X axis: kỳ quay (index), Y axis: tổng giá trị.
- Dots màu fuchsia `#c026d3`
- Reference line tại `EXPECTED_SUM` (Mega: 138, Power: 168) — đường dash
- 100 kỳ gần nhất, reversed để mới nhất bên phải

---

### ViewAllModal

**Layout**: Modal fullscreen overlay, dark background.
- Header pinned (sticky top): tiêu đề + nút `✕` đóng
- Tabs: `Tần Suất | Lạnh | Cặp Số | Bộ Ba`
- Nội dung: full list của dataset tương ứng

---

### InfoModal

**Layout**: Modal centered, scrollable content.
- Header pinned: "Vietlott Analytics" + `✕`
- Nội dung: Giới thiệu về Vietlott, các sản phẩm, liên hệ

---

### AdBanner

**Layout**: Responsive AdSense banner.
- 3 positions: `top` (dưới JackpotCard), `mid` (giữa trang), `bottom` (cuối trang)
- Chứa `<ins class="adsbygoogle">` với slot tương ứng
- Fallback ẩn nếu AdSense chưa load

---

## Predict Page Design (`/predict`)

### Layout

```
[Sticky top nav: ← Dashboard | Dự Đoán (tiêu đề) | 6/45 | 6/55 toggle]

[Scrollable content, max-w-3xl:]
  [Algorithm selector: 🎯 Cơ Bản | 🧠 4 Lớp]
  [Input + Actions: [input số hạt giống] [Tìm btn] [Tạo 5 Vé btn]]
  [Error message]
  [Tickets list (A-E), mỗi vé: label | balls | action]
  [Interactive Grid: tất cả số (1-45 hoặc 1-55), click để bật/tắt]

[Fixed bottom footer: Mua Vé Qua SMS btn (full-width, teal gradient)]
```

### Ball Component

- Vòng tròn `w-12 h-12 rounded-full`
- Số > 40: nền `bg-red-500`, số ≤ 40: nền `bg-blue-600`
- Số là input "hạt giống": ring `ring-4 ring-amber-400`
- Empty slot: vòng tròn xám `bg-gray-800/60`

### Grid Buttons

- Active (selected): `bg-blue-600` (số ≤ 40) hoặc `bg-red-500` (số > 40)
- Inactive: `bg-white text-gray-800`
- Disabled: opacity-30, not clickable khi đã đủ 6 số
- Input numbers: thêm ring `ring-amber-400`

---

## Animation & Motion

- **Page load**: `animate-in fade-in slide-in-from-bottom-4 duration-700`
- **Spinner**: `animate-spin` trên Loader2 icon
- **Header hover**: `group-hover:-translate-x-0.5`
- **Button press**: `active:scale-[0.98]` / `active:scale-95` (grid buttons)
- **Transition**: `transition-all` trên tất cả interactive elements

---

## PWA / Mobile

- **Manifest**: `manifest.json` (via `manifest.js`) — name, icons, theme_color `#10b981`, background `#0E1217`
- **Apple PWA**: `appleWebApp: capable: true`, `statusBarStyle: "black-translucent"`
- **Icons**: `icon.png` (512×512), `apple-icon.png`
- **Theme color**: `#0E1217`

---

## SEO & Meta

- **Title**: "Vietlott Dashboard - Phân Tích & Dự Đoán Xổ Số"
- **Description**: Bao gồm keywords: Vietlott, Mega 6/45, Power 6/55, dự đoán, thống kê
- **OpenGraph**: image `/og-image.png`, locale `vi_VN`
- **Twitter card**: `summary_large_image`
- **Canonical URL**: `https://vietlott-dashboard.vercel.app`
