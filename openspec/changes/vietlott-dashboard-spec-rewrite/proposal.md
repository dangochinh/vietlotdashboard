# Vietlott Dashboard — Project Proposal (Spec Rewrite)

## Tổng Quan

**Vietlott Dashboard** là một ứng dụng web phân tích thống kê xổ số Vietlott (Mega 6/45 và Power 6/55) dành cho người dùng Việt Nam. Hệ thống tự động thu thập kết quả xổ số bằng scraper Python, lưu trữ vào Google Sheets, rồi hiển thị trực quan qua giao diện Next.js. Ngoài thống kê, ứng dụng còn cung cấp tính năng dự đoán bộ số lottery dựa trên dữ liệu lịch sử.

Dự án đang **live trên Vercel** tại `https://vietlott-dashboard.vercel.app` và đã được monetize bằng Google AdSense.

---

## Mục Tiêu

1. **Cung cấp thống kê xổ số chuẩn xác, trực quan** cho hai loại: Mega 6/45 và Power 6/55.
2. **Tự động cập nhật dữ liệu** mỗi ngày lúc 19:30 VNT qua GitHub Actions.
3. **Tính năng dự đoán thông minh** — sinh vé dựa trên 2 thuật toán (Co-occurrence và 4-Layer Filtering).
4. **Đa dạng phân tích thống kê** — tần suất, số lạnh, cặp số, bộ ba, chẵn/lẻ, tổng điểm.
5. **Trải nghiệm mobile-first, PWA** — có thể cài lên màn hình chính iPhone/Android.

---

## Phạm Vi Dự Án (As-Is)

### A. Scraper (Python)

- **Nguồn dữ liệu**: `minhngoc.net.vn` — scrape kết quả xổ số mới nhất bằng BeautifulSoup.
- **Lưu trữ**: Google Sheets (sheet `Mega645` và `Power655`) via `gspread`.
- **Tự động hóa**: GitHub Actions chạy mỗi ngày 19:30 VNT (`cron: '30 12 * * *'`).
- **Cấu trúc dữ liệu**: Mỗi hàng là 1 kỳ quay — `Kỳ QSMT / Ngày`, `Số 1–6`, `Số Đặc Biệt` (Power 6/55), `Ngày Cào`.

### B. Dashboard (Next.js 16 + React 19)

#### Tech Stack
- **Framework**: Next.js 16 (App Router) + React 19
- **Styling**: TailwindCSS v4
- **Charts**: Recharts v3
- **Icons**: Lucide React
- **Data fetching**: SWR (cache 5 phút)
- **Deploy**: Vercel
- **Monetize**: Google AdSense (`ca-pub-9806354177150523`)

#### Pages

| Route | Component | Chức năng |
|---|---|---|
| `/` | `page.js` | Dashboard thống kê chính |
| `/predict` | `predict/page.js` | Trang dự đoán vé số |

#### API Routes

| Route | Chức năng |
|---|---|
| `GET /api/vietlott?type=Mega645\|Power655` | Lấy lịch sử xổ số từ Google Sheets |
| `GET /api/jackpot?type=Mega645\|Power655` | Scrape realtime jackpot từ minhngoc.net.vn |

#### Components Chính

| Component | Chức năng |
|---|---|
| `Header` | Nav bar có toggle Mega/Power, link Predict, nút Info |
| `JackpotCard` | Hiển thị giá trị jackpot + đếm ngược kỳ tiếp theo |
| `FrequencyChart` | Bar chart top 15 số xuất hiện nhiều nhất |
| `FullFrequencyChart` | Bar chart đầy đủ tất cả số theo thứ tự + fullscreen modal |
| `HistoryTable` | Bảng lịch sử 10 kỳ gần nhất |
| `PairsChart` | Bar chart top 15 cặp số xuất hiện cùng nhau |
| `TriosChart` | Bar chart top 15 bộ ba số xuất hiện cùng nhau |
| `ColdNumbersChart` | Bar chart 15 số vắng mặt lâu nhất |
| `EvenOddPie` | Pie chart phân bố chẵn/lẻ |
| `SumScatter` | Scatter plot tổng giá trị 100 kỳ gần nhất |
| `ViewAllModal` | Modal xem đầy đủ dữ liệu (frequency, pairs, trios, cold) |
| `InfoModal` | Modal giới thiệu về Vietlott |
| `AdBanner` | Component Google AdSense banner (3 vị trí: top, mid, bottom) |
| `Ball` | Component hiển thị bóng số lottery |

#### Hooks

| Hook | Chức năng |
|---|---|
| `useVietlottData(activeTab)` | SWR fetch data từ `/api/vietlott` + `/api/jackpot` |
| `useCountdown(activeTab)` | Đếm ngược đến kỳ quay tiếp theo |

#### Lib / Constants

| File | Nội dung |
|---|---|
| `lib/constants.js` | DRAW_DAYS, DRAW_HOUR, CHART_COLORS, MAX_NUMBERS, EXPECTED_SUM |
| `lib/prediction.js` | 2 thuật toán: `predictByCoOccurrence`, `predictBy4LayerFiltering` |

#### Tính Năng Predict Page (`/predict`)

- Nhập 1–3 số "hạt giống"
- Chọn thuật toán: **Cơ Bản** (co-occurrence) hoặc **4 Lớp** (4-layer filtering)
- Sinh tối đa **5 vé** cùng lúc (A–E)
- Interactive **grid chọn số** thủ công
- Nút **Mua Vé Qua SMS** → tự tạo cú pháp `645 K1 S xx xx xx...` gửi đến đầu số `9969`
- Persist `client_id` trong localStorage để cá nhân hóa RNG

---

## Non-Goals

- Không hỗ trợ các game xổ số khác (Max3D, Keno, v.v.)
- Không có hệ thống user account/login
- Không có back-end database riêng — chỉ dùng Google Sheets làm data store
- Không hỗ trợ mua vé online thực sự (chỉ hỗ trợ SMS)

---

## Kiến Trúc Tổng Thể

```
GitHub Actions (daily cron 19:30 VNT)
       │
       ▼
scraper/main.py (Python + BeautifulSoup)
       │ scrape minhngoc.net.vn
       ▼
Google Sheets (Mega645 / Power655 worksheets)
       │
       ▼
/api/vietlott (Next.js Route Handler → Google Sheets API)
       │
       ▼
useVietlottData hook (SWR, cache 5 min)
       │
       ▼
Dashboard Page → Charts, Tables, Modals
       │
       ▼
/predict page → Prediction algorithms → SMS tickets
```

---

## Trạng Thái Hiện Tại

| Hạng mục | Trạng thái |
|---|---|
| Scraper Python | ✅ Hoạt động, chạy daily |
| Dashboard thống kê | ✅ Đầy đủ 8 loại chart |
| Trang dự đoán | ✅ 5-ticket multi-generation |
| PWA / Mobile | ✅ Manifest, icon, apple-icon |
| SEO | ✅ Metadata, OpenGraph, Twitter card |
| AdSense | ✅ 3 vị trí banner |
| Pinned header | ✅ Header và close button trong modal đã được pin |
