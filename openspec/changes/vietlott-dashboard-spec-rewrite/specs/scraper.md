# Spec: Scraper Module

## Mục Đích

Thu thập tự động kết quả xổ số Vietlott từ `minhngoc.net.vn` và lưu vào Google Sheets mỗi ngày.

---

## Files

| File | Chức năng |
|---|---|
| `scraper/main.py` | Entry point — scrape & update Google Sheets |
| `scraper/seed.py` | Script backfill lịch sử cũ từ file HTML |
| `scraper/explore.py` | Script khám phá cấu trúc HTML |
| `scraper/test_scraper.py` | Test scraper với file HTML local |
| `scraper/requirements.txt` | Python dependencies |
| `scraper/credentials.json` | Google Service Account (gitignored) |
| `.github/workflows/scraper.yml` | GitHub Actions CI |

---

## Data Flow

```
minhngoc.net.vn
    │ HTTP GET (beautifulsoup)
    ▼
scrape_minhngoc_page(url) → list of draw results
    │
    ▼
update_worksheet(worksheet, results)
    │ skip existing draw IDs
    ▼
Google Sheets (tab: Mega645 / Power655)
```

---

## Google Sheets Schema

### Worksheet: `Mega645`

| Column | Header | Ví dụ |
|---|---|---|
| A | `Kỳ QSMT / Ngày` | `Kỳ 01492 \| 03/04/2026` |
| B | `Số 1` | `07` |
| C | `Số 2` | `14` |
| D | `Số 3` | `22` |
| E | `Số 4` | `30` |
| F | `Số 5` | `38` |
| G | `Số 6` | `44` |
| H | `Số Đặc Biệt` | `` (empty for Mega) |
| I | `Ngày Cào` | `2026-04-03 19:45:12` |

### Worksheet: `Power655`

Giống Mega645 nhưng cột H `Số Đặc Biệt` có giá trị (số thứ 7 trong Power 6/55).

---

## Scraping Logic

### `scrape_minhngoc_page(url)`

1. HTTP GET với custom User-Agent (Chromium), verify=False, timeout=20s
2. Parse HTML bằng BeautifulSoup
3. Tìm `.box_kqxs` hoặc `.boxkqxsdientoan` divs
4. Với mỗi draw box:
   - Extract draw ID bằng regex `#?(\d+)`
   - Extract date bằng regex `(\d{2}/\d{2}/\d{4})`
   - Extract balls từ `.bool` hoặc `.finnish` divs
   - Skip nếu balls < 6
5. Return list of dicts: `{draw_id, draw_date, draw_info, numbers, special, scraped_at}`

### `update_worksheet(worksheet, results)`

1. Get all existing rows từ sheet
2. Extract existing draw IDs (regex trên cột A)
3. Sort results by draw_id ascending (chronological order)
4. Với mỗi result: nếu ID chưa tồn tại → `append_row` + sleep 1s
5. Log số records được thêm

---

## CI/CD

**File**: `.github/workflows/scraper.yml`
**Schedule**: `cron: '30 12 * * *'` = 19:30 VNT mỗi ngày
**Trigger**: Cũng có `workflow_dispatch` cho manual trigger

```yaml
jobs:
  scrape-and-update:
    runs-on: ubuntu-latest
    steps:
      - Checkout Repository
      - Setup Python 3.11
      - pip install -r requirements.txt
      - python main.py (với GOOGLE_CREDENTIALS secret)
```

---

## Environment Variables / Secrets

| Variable | Mô tả | Default |
|---|---|---|
| `GOOGLE_CREDENTIALS` | JSON của Google Service Account | File `credentials.json` local |
| `GOOGLE_SHEET_URL` | URL của Google Sheets | Hardcoded URL mặc định |

---

## Dependencies (Python)

```
requests
beautifulsoup4
gspread
google-auth
```

---

## Giới Hạn Hiện Tại

- Chỉ scrape trang mới nhất (~5–10 kỳ gần đây). Không crawl pagination history.
- Script `seed.py` dùng để backfill lịch sử từ static HTML file đã save sẵn.
- SSL verification bị tắt (`verify=False`) do minhngoc.net.vn có SSL issues.
