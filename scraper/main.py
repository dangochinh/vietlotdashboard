import os
import json
import re
import requests
import gspread
from google.oauth2.service_account import Credentials
from datetime import datetime

URLS = {
    'Mega645': 'https://raw.githubusercontent.com/vietvudanh/vietlott-data/master/data/power645.jsonl',
    'Power655': 'https://raw.githubusercontent.com/vietvudanh/vietlott-data/master/data/power655.jsonl'
}

SCOPES = [
    'https://spreadsheets.google.com/feeds',
    'https://www.googleapis.com/auth/drive'
]


def get_google_sheet():
    creds_path = os.path.join(os.path.dirname(__file__), 'credentials.json')

    if not os.path.exists(creds_path):
        creds_env = os.environ.get('GOOGLE_CREDENTIALS')
        if creds_env:
            with open(creds_path, 'w') as f:
                f.write(creds_env)
        else:
            raise FileNotFoundError("credentials.json not found and GOOGLE_CREDENTIALS env var is not set.")

    creds = Credentials.from_service_account_file(creds_path, scopes=SCOPES)
    client = gspread.authorize(creds)

    sheet_url = os.environ.get(
        'GOOGLE_SHEET_URL',
        "https://docs.google.com/spreadsheets/d/1rkURU2bHuhgtf1k5uIzfG7sH8vQQ0VyaSra6M9WTo18/edit"
    )
    return client.open_by_url(sheet_url)


def fetch_vietlott_data(url):
    print(f"Fetching: {url}")
    try:
        response = requests.get(url, timeout=15)
        response.raise_for_status()

        lines = [line.strip() for line in response.text.split('\n') if line.strip()]
        if not lines:
            return None

        last_line = lines[-1]
        data = json.loads(last_line)

        draw_date = datetime.strptime(data['date'], '%Y-%m-%d').strftime('%d/%m/%Y')
        draw_id = data['id']
        draw_info = f"Kỳ {draw_id} | {draw_date}"

        numbers = [f"{num:02d}" for num in data['result']]

        return {
            'draw_id': draw_id,
            'draw_info': draw_info,
            'numbers': numbers,
            'scraped_at': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None


def append_to_sheet(worksheet, data):
    existing_records = worksheet.get_all_records()

    existing_ids = []
    for r in existing_records:
        val = str(r.get('Kỳ QSMT / Ngày', ''))
        match = re.search(r'K[yỳ][\s:]*(\d+)', val, re.IGNORECASE)
        if match:
            existing_ids.append(str(match.group(1)).lstrip('0'))

    draw_id = str(data['draw_id']).lstrip('0')
    if draw_id in existing_ids:
        print(f"Data for Ky {data['draw_id']} already exists. Skipping.")
        return

    row = [data['draw_info']] + data['numbers']
    while len(row) < 8:
        row.append("")
    row.append(data['scraped_at'])

    worksheet.append_row(row)
    safe_info = data['draw_info'].replace('Kỳ', 'Ky')
    print(f"Successfully appended {safe_info} to sheet.")


def main():
    print("Starting Vietlott API Scraper...")
    sheet = get_google_sheet()

    for name, url in URLS.items():
        print(f"--- Processing {name} ---")
        data = fetch_vietlott_data(url)
        if data and data['numbers']:
            print(f"Found data for Ky {data['draw_id']}")
            try:
                worksheet = sheet.worksheet(name)
                if len(worksheet.get_all_values()) == 0:
                    worksheet.append_row(["Kỳ QSMT / Ngày", "Số 1", "Số 2", "Số 3", "Số 4", "Số 5", "Số 6", "Số Đặc Biệt", "Ngày Cào"])
                append_to_sheet(worksheet, data)
            except gspread.exceptions.WorksheetNotFound:
                print(f"Worksheet '{name}' not found. Please create it.")
        else:
            print(f"Failed to scrape data for {name}")


if __name__ == "__main__":
    main()
