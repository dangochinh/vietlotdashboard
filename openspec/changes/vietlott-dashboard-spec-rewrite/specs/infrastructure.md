# Spec: Infrastructure & Deployment

## Deployment

| Layer | Platform | Mô tả |
|---|---|---|
| Frontend + API | Vercel | Auto-deploy từ `main` branch |
| Data Store | Google Sheets | Hai tabs: `Mega645`, `Power655` |
| CI/CD Scraper | GitHub Actions | Daily cron 19:30 VNT |

---

## Project Structure

```
VietlottDashboard/
├── .agent/                     # OpenSpec agent config
│   ├── skills/
│   └── workflows/
├── .github/
│   └── workflows/
│       └── scraper.yml         # GitHub Actions CI
├── openspec/
│   ├── config.yaml             # OpenSpec config (schema: spec-driven)
│   ├── changes/                # Change directories
│   │   ├── archive/
│   │   ├── add-vietlott-company-info/  # Completed change
│   │   └── vietlott-dashboard-spec-rewrite/  # This change
│   └── specs/                  # Global specs (if any)
├── dashboard/                  # Next.js app
│   ├── .env.example
│   ├── package.json
│   ├── next.config.mjs
│   └── src/
│       └── app/
│           ├── layout.js
│           ├── page.js         # Dashboard chính
│           ├── globals.css
│           ├── manifest.js     # PWA manifest
│           ├── icon.png
│           ├── apple-icon.png
│           ├── api/
│           │   ├── vietlott/route.js   # Google Sheets data API
│           │   └── jackpot/route.js    # Realtime jackpot scraper API
│           ├── components/
│           │   ├── AdBanner.js
│           │   ├── Ball.js
│           │   ├── ColdNumbersChart.js
│           │   ├── EvenOddPie.js
│           │   ├── FrequencyChart.js
│           │   ├── FullFrequencyChart.js
│           │   ├── Header.js
│           │   ├── HistoryTable.js
│           │   ├── InfoModal.js
│           │   ├── JackpotCard.js
│           │   ├── PairsChart.js
│           │   ├── SumScatter.js
│           │   ├── TriosChart.js
│           │   └── ViewAllModal.js
│           ├── hooks/
│           │   ├── useCountdown.js
│           │   └── useVietlottData.js
│           ├── lib/
│           │   ├── constants.js
│           │   └── prediction.js
│           └── predict/
│               └── page.js     # Prediction page
├── scraper/                    # Python scraper
│   ├── main.py
│   ├── seed.py
│   ├── explore.py
│   ├── test_scraper.py
│   ├── requirements.txt
│   └── credentials.json        # Gitignored
├── mega_minhngoc.html          # Static HTML for seeding (Mega)
├── power_mn.html               # Static HTML for seeding (Power)
└── README.md
```

---

## Dependencies

### Frontend (npm)

| Package | Version | Chức năng |
|---|---|---|
| `next` | 16.1.6 | Framework |
| `react` / `react-dom` | 19.2.3 | UI library |
| `recharts` | ^3.7.0 | Chart library |
| `lucide-react` | ^0.575.0 | Icons |
| `swr` | ^2.4.0 | Data fetching + cache |
| `googleapis` | ^171.4.0 | Google Sheets API |
| `cheerio` | ^1.2.0 | Server-side HTML parsing (jackpot API) |
| `date-fns` | ^4.1.0 | Date utilities |
| `tailwindcss` | ^4 | CSS framework |

### Python (pip)

```
requests
beautifulsoup4
gspread
google-auth
urllib3
```

---

## Environment Variables

### Vercel (Production)

| Variable | Bắt buộc | Mô tả |
|---|---|---|
| `GOOGLE_CREDENTIALS` | ✅ | JSON string của Google Service Account |
| `GOOGLE_SHEET_ID` | ❌ | ID sheet (có default hardcoded) |

### GitHub Actions

| Secret | Mô tả |
|---|---|
| `GOOGLE_CREDENTIALS` | JSON của Google Service Account để scraper ghi vào Sheet |

### Local Development

Copy `.env.example` → `.env.local` và điền:
- `GOOGLE_CREDENTIALS`: paste nội dung `credentials.json`
- Hoặc đặt `credentials.json` tại `../scraper/credentials.json` (relative đến `dashboard/`)

---

## Google Service Account

- Scope cho Sheets API: `https://www.googleapis.com/auth/spreadsheets.readonly` (read-only cho dashboard API)
- Scope cho gspread (scraper): `https://spreadsheets.google.com/feeds`, `https://www.googleapis.com/auth/drive` (read-write)
- Share Google Sheet với service account email

---

## PWA Configuration (`manifest.js`)

```js
{
  name: "Vietlott Dashboard",
  short_name: "Vietlott",
  theme_color: "#10b981",
  background_color: "#0E1217",
  display: "standalone",
  start_url: "/",
  icons: [icon 192x192, icon 512x512]
}
```

---

## AdSense

- Publisher ID: `ca-pub-9806354177150523`  
- Verification: `<meta name="google-adsense-account">` trong `<head>`
- Script strategy: `beforeInteractive` (load sớm nhất)
- 3 banner slots: top (dưới Jackpot), mid (giữa trang), bottom (cuối trang)
- File: `AdBanner.js` component

---

## Vercel Deployment Settings

- **Framework**: Next.js (auto-detect)
- **Build command**: `npm run build`
- **Output directory**: `.next`
- **Root directory**: `dashboard/` (cần cấu hình trong Vercel)
- **Node version**: 18+ (Next.js 16 requirement)

---

## SEO & Analytics

| Feature | Implementation |
|---|---|
| Title | "Vietlott Dashboard - Phân Tích & Dự Đoán Xổ Số" |
| Meta description | Đầy đủ keywords xổ số tiếng Việt |
| OpenGraph | Locale `vi_VN`, image `/og-image.png` |
| Twitter Card | `summary_large_image` |
| Canonical URL | `https://vietlott-dashboard.vercel.app` |
| Keywords | Vietlott, Mega 6/45, Power 6/55, xổ số, dự đoán, thống kê |
