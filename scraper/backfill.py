import os
import sys
import re
import json
import time
import requests
from datetime import datetime
import gspread
from google.oauth2.service_account import Credentials

sys.stdout.reconfigure(encoding='utf-8')

SCOPES = [
    'https://spreadsheets.google.com/feeds',
    'https://www.googleapis.com/auth/drive'
]

def get_google_sheet():
    creds_path = os.path.join(os.path.dirname(__file__), 'credentials.json')
    if not os.path.exists(creds_path):
        creds_env = os.environ.get('GOOGLE_CREDENTIALS')
        if creds_env:
            with open(creds_path, 'w', encoding='utf-8') as f:
                f.write(creds_env)
        else:
            raise FileNotFoundError("credentials.json not found.")

    creds = Credentials.from_service_account_file(creds_path, scopes=SCOPES)
    client = gspread.authorize(creds)
    sheet_url = os.environ.get(
        'GOOGLE_SHEET_URL',
        "https://docs.google.com/spreadsheets/d/1rkURU2bHuhgtf1k5uIzfG7sH8vQQ0VyaSra6M9WTo18/edit"
    )
    return client.open_by_url(sheet_url)

def fetch_vietvudanh(game_file):
    url = f"https://raw.githubusercontent.com/vietvudanh/vietlott-data/main/data/{game_file}.jsonl"
    r = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'}, timeout=20)
    r.raise_for_status()
    records = []
    for line in r.text.strip().split('\n'):
        if line.strip():
            records.append(json.loads(line))
    return records

def backfill():
    print(f"Starting backfill at {datetime.now()}")
    sheet = get_google_sheet()
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Fetch data
    print("Fetching historical datasets from vietvudanh repository...")
    mega_records = fetch_vietvudanh('power645')
    power_records = fetch_vietvudanh('power655')

    # Add most recent draws not yet committed to vietvudanh
    mega_records.append({
        'id': '01569',
        'date': '2026-09-30',
        'result': [2, 9, 24, 27, 30, 33],
        'process_time': now_str
    })

    power_records.append({
        'id': '01404',
        'date': '2026-09-29',
        'result': [2, 4, 13, 17, 35, 36, 11],
        'process_time': now_str
    })

    tasks = [
        ('Mega645', mega_records, False),
        ('Power655', power_records, True)
    ]

    for game, records, is_power in tasks:
        print(f"\n================ Processing {game} ================")
        ws = sheet.worksheet(game)
        existing_rows = ws.get_all_values()
        existing_ids = set()

        for row in existing_rows:
            if not row or not row[0]:
                continue
            m = re.search(r'(\d+)', row[0])
            if m:
                existing_ids.add(m.group(1).zfill(5))

        print(f"Existing rows in {game}: {len(existing_rows)} (Unique IDs: {len(existing_ids)})")

        rows_to_append = []
        for r in records:
            did = str(r['id']).zfill(5)
            if did in existing_ids:
                continue

            dt = datetime.strptime(r['date'], '%Y-%m-%d').strftime('%d/%m/%Y')
            draw_info = f"Kỳ {did} | {dt}"
            balls = [str(x).zfill(2) for x in r['result'][:6]]
            special = str(r['result'][6]).zfill(2) if is_power and len(r['result']) > 6 else ""
            scraped_at = r.get('process_time', now_str)

            row = [draw_info] + balls + [special, scraped_at]
            rows_to_append.append((int(did), row))

        # Sort by draw ID ascending
        rows_to_append.sort(key=lambda x: x[0])
        clean_rows = [x[1] for x in rows_to_append]

        print(f"Found {len(clean_rows)} new rows to append for {game}.")
        if clean_rows:
            print(f"From: {clean_rows[0][0]} to {clean_rows[-1][0]}")
            # Append in batches of 20
            batch_size = 20
            for i in range(0, len(clean_rows), batch_size):
                chunk = clean_rows[i:i + batch_size]
                ws.append_rows(chunk)
                print(f"Appended rows {i + 1} to {min(i + batch_size, len(clean_rows))} for {game}")
                time.sleep(1)
        else:
            print("No new rows needed.")

    print("\nBackfill completed successfully!")

if __name__ == '__main__':
    backfill()
