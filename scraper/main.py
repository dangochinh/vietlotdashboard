import os
import sys
import json
import re
import requests
import gspread
from google.oauth2.service_account import Credentials
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
import time
import urllib3

# Fix encoding on Windows consoles
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Disable insecure request warnings for simplified SSL handling
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Game URLs and configuration
URLS = {
    'Mega645': 'https://www.minhngoc.net.vn/ket-qua-xo-so/dien-toan-vietlott/mega-6x45.html',
    'Power655': 'https://www.minhngoc.net.vn/ket-qua-xo-so/dien-toan-vietlott/power-6x55.html'
}

FALLBACK_FILES = {
    'Mega645': 'power645',
    'Power655': 'power655'
}

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'vi,en;q=0.9',
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
            with open(creds_path, 'w', encoding='utf-8') as f:
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

def scrape_minhngoc_page(url):
    """Scrapes a single Minh Ngoc page and returns a list of draw results."""
    print(f"Scraping Minh Ngoc: {url}")
    try:
        response = requests.get(url, headers=HEADERS, verify=False, timeout=15)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        boxes = soup.find_all('div', class_='box_kqxs')
        if not boxes:
            boxes = soup.select('.boxkqxsdientoan')
            
        results = []
        for box in boxes:
            header = box.find(lambda tag: tag.name in ['h4', 'div', 'td'] and ('Kỳ' in tag.text or 'Ky' in tag.text))
            if not header:
                continue
            
            text = header.get_text(separator=' ', strip=True)
            match_id = re.search(r'#?(\d+)', text)
            match_date = re.search(r'(\d{2}/\d{2}/\d{4})', text)
            
            if not match_id or not match_date:
                continue
            
            draw_id = match_id.group(1).zfill(5)
            draw_date = match_date.group(1)
            
            balls = []
            ball_elements = box.find_all('div', class_=re.compile(r'bool|finnish'))
            if not ball_elements:
                ul = box.find('ul', class_='result-number')
                if ul:
                    ball_elements = ul.find_all('li')
                
            for el in ball_elements:
                val = el.get_text(strip=True)
                if val.isdigit():
                    balls.append(val.zfill(2))
            
            if len(balls) < 6:
                continue
            
            main_numbers = balls[:6]
            special_number = balls[6] if len(balls) > 6 else ""
            
            results.append({
                'draw_id': draw_id,
                'draw_date': draw_date,
                'draw_info': f"Kỳ {draw_id} | {draw_date}",
                'numbers': main_numbers,
                'special': special_number,
                'scraped_at': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            })
            
        print(f"Minh Ngoc returned {len(results)} draws.")
        return results
    except Exception as e:
        print(f"Warning: Minh Ngoc scrape failed ({type(e).__name__}: {e})")
        return []

def fetch_fallback_records(game):
    """Fetches verified historical/daily dataset as fallback."""
    file_name = FALLBACK_FILES.get(game)
    if not file_name:
        return []
    
    url = f"https://raw.githubusercontent.com/vietvudanh/vietlott-data/main/data/{file_name}.jsonl"
    print(f"Fetching fallback dataset from: {url}")
    try:
        r = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'}, timeout=20)
        r.raise_for_status()
        
        parsed = []
        for line in r.text.strip().split('\n'):
            if not line.strip():
                continue
            item = json.loads(line)
            did = str(item['id']).zfill(5)
            dt = datetime.strptime(item['date'], '%Y-%m-%d').strftime('%d/%m/%Y')
            balls = [str(x).zfill(2) for x in item['result'][:6]]
            special = str(item['result'][6]).zfill(2) if len(item['result']) > 6 else ""
            
            parsed.append({
                'draw_id': did,
                'draw_date': dt,
                'draw_info': f"Kỳ {did} | {dt}",
                'numbers': balls,
                'special': special,
                'scraped_at': item.get('process_time', datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
            })
        print(f"Fallback source loaded {len(parsed)} draws.")
        return parsed
    except Exception as e:
        print(f"Warning: Fallback source failed: {e}")
        return []

def update_worksheet(worksheet, game, results):
    """Appends results to Google Sheet, auto-filling any gaps and skipping duplicates."""
    existing_records = worksheet.get_all_values()
    if not existing_records:
        worksheet.append_row(["Kỳ QSMT / Ngày", "Số 1", "Số 2", "Số 3", "Số 4", "Số 5", "Số 6", "Số Đặc Biệt", "Ngày Cào"])
        existing_ids = set()
        max_existing_id = 0
    else:
        existing_ids = set()
        max_existing_id = 0
        for row in existing_records:
            if not row or not row[0]:
                continue
            match = re.search(r'(\d+)', row[0])
            if match:
                did_int = int(match.group(1))
                existing_ids.add(str(did_int).zfill(5))
                if did_int > max_existing_id:
                    max_existing_id = did_int

    print(f"Current sheet has {len(existing_ids)} draws. Latest ID: {max_existing_id}")

    # Check if we got results and whether there's a gap
    all_candidates = list(results) if results else []

    # If results are empty OR if there's a gap between max_existing_id and candidates, check fallback
    needs_fallback = False
    if not all_candidates:
        print("No results from primary source. Attempting fallback...")
        needs_fallback = True
    else:
        min_candidate_id = min(int(x['draw_id']) for x in all_candidates)
        if min_candidate_id > max_existing_id + 1:
            print(f"Gap detected! Latest in sheet is {max_existing_id}, but earliest in primary scrape is {min_candidate_id}.")
            needs_fallback = True

    if needs_fallback:
        fallback_data = fetch_fallback_records(game)
        if fallback_data:
            # Merge fallback data
            id_to_record = {r['draw_id']: r for r in fallback_data}
            for r in all_candidates:
                id_to_record[r['draw_id']] = r
            all_candidates = list(id_to_record.values())

    # Filter out already existing records
    new_records = [r for r in all_candidates if r['draw_id'] not in existing_ids]
    new_records.sort(key=lambda x: int(x['draw_id']))

    if not new_records:
        print("Sheet is already up to date. No new data to add.")
        return 0

    print(f"Preparing to append {len(new_records)} new draws (from Kỳ {new_records[0]['draw_id']} to Kỳ {new_records[-1]['draw_id']})...")

    # Format rows
    rows_to_append = []
    for data in new_records:
        row = [data['draw_info']] + data['numbers'] + [data['special'], data['scraped_at']]
        rows_to_append.append(row)

    # Batch append in chunks of 20
    batch_size = 20
    for i in range(0, len(rows_to_append), batch_size):
        chunk = rows_to_append[i:i + batch_size]
        worksheet.append_rows(chunk)
        print(f"Appended {len(chunk)} rows (progress: {min(i + batch_size, len(rows_to_append))}/{len(rows_to_append)})")
        time.sleep(1)

    print(f"Successfully added {len(rows_to_append)} new records to {game}.")
    return len(rows_to_append)

def main():
    print(f"=== Starting Vietlott Scraper at {datetime.now()} ===")
    sheet = get_google_sheet()
    
    for game, url in URLS.items():
        print(f"\n--- Processing {game} ---")
        try:
            worksheet = sheet.worksheet(game)
            results = scrape_minhngoc_page(url)
            update_worksheet(worksheet, game, results)
        except Exception as e:
            print(f"Failed to process {game}: {type(e).__name__}: {e}")

    print(f"\n=== Vietlott Scraper finished at {datetime.now()} ===")

if __name__ == "__main__":
    main()
