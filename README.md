# 📊 Vietlott Dashboard

A fully automated system to track, store, and visualize Vietnamese Vietlott lottery results. Built with a Next.js dashboard and a Python scraper pipeline — zero manual effort required after setup.

**Live Demo:** [https://vietlott-dashboard.vercel.app/](https://vietlott-dashboard.vercel.app/)

---

## 📖 About

**Vietlott Dashboard** is a two-part project:
1. **Scraper** — A Python script that automatically fetches the latest Vietlott draw results and writes them to a Google Sheet, triggered daily by GitHub Actions.
2. **Dashboard** — A Next.js web application that reads from the Google Sheet and presents the data in an interactive, visual format.

Data is stored in **Google Sheets**, which acts as a lightweight, zero-cost cloud database — no backend server needed.

## ✨ Features

### 📈 Dashboard
- **Live Results** — Displays the latest Vietlott draw results automatically.
- **Historical Data** — Browse and filter past draw results by date.
- **Statistics & Charts** — Visual analysis with interactive charts (frequency heatmaps, trends over time, etc.).
- **Multiple Lottery Types** — Supports Mega 6/45 and Power 6/55 game types.
- **SWR Data Fetching** — Stale-while-revalidate for a smooth, always-fresh user experience.

### 🤖 Automation
- **Daily Scheduled Scrape** — GitHub Actions runs the scraper every day at **19:30 Vietnam Time (12:30 UTC)** automatically.
- **Duplicate Prevention** — The scraper only inserts new draw data, safely ignoring already-stored entries.
- **Manual Trigger** — Can be triggered on-demand via GitHub Actions `workflow_dispatch`.

## 🏗️ Architecture

```
vietlotdashboard/
├── dashboard/              # Next.js web application
│   └── src/app/            # App Router pages and API routes
├── scraper/                # Python data ingestion pipeline
│   ├── main.py             # Scraper entry point (fetch + write to Sheets)
│   ├── seed.py             # One-time seed script for historical data
│   ├── explore.py          # Data exploration utility
│   └── requirements.txt    # Python dependencies
├── .github/
│   └── workflows/
│       └── scraper.yml     # GitHub Actions: daily auto-scrape at 19:30 VNT
├── mega_minhngoc.html      # Mega 6/45 static reference page
└── power_mn.html           # Power 6/55 static reference page
```

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **UI Library** | React 19 |
| **Styling** | Tailwind CSS v4 |
| **Charts** | [Recharts](https://recharts.org/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Data Fetching** | [SWR](https://swr.vercel.app/) |
| **Data Storage** | Google Sheets (via Google Sheets API) |
| **Scraper** | Python 3.11, `requests`, `gspread`, `cheerio` |
| **Automation** | GitHub Actions (cron schedule) |
| **Deployment** | [Vercel](https://vercel.com/) |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- A Google Cloud project with **Google Sheets API** enabled
- A Google Service Account with a credentials JSON file

---

### Dashboard (Frontend)

1. Navigate to the dashboard directory:
   ```bash
   cd dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the example env file and fill in your values:
   ```bash
   cp .env.example .env.local
   ```
   ```env
   GOOGLE_SHEET_ID=your_google_sheet_id
   GOOGLE_CLIENT_EMAIL=your_service_account_email
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

---

### Scraper (Python)

1. Navigate to the scraper directory:
   ```bash
   cd scraper
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Place your Google Service Account credentials file in `scraper/credentials.json`.

4. Run the scraper manually:
   ```bash
   python main.py
   ```

---

### Automation (GitHub Actions)

The workflow in `.github/workflows/scraper.yml`:
- Runs **automatically at 19:30 VNT every day**
- Can also be triggered manually from the **Actions** tab on GitHub
- Reads `GOOGLE_CREDENTIALS` from GitHub repository **Secrets**

To enable: add your Google Service Account JSON as a GitHub Secret named `GOOGLE_CREDENTIALS`.

## 👤 Author

**Đặng Ngọc Chính**
- Portfolio: [dangochinh.github.io](https://dangochinh.github.io/)
- GitHub: [@dangochinh](https://github.com/dangochinh)
