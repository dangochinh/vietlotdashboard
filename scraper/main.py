import os
import json
import re
import requests
import gspread
from google.oauth2.service_account import Credentials
from datetime import datetime, timedelta
from bs4 import BeautifulSoup
import time
import urllib3

# Disable insecure request warnings for simplified SSL handling
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Game URLs and configuration
URLS = {
    'Mega645': 'https://www.minhngoc.net.vn/ket-qua-xo-so/dien-toan-vietlott/mega-6x45.html',
    'Power655': 'https://www.minhngoc.net.vn/ket-qua-xo-so/dien-toan-vietlott/power-6x55.html'
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
    """Scrapes a single page and returns a list of results."""
    print(f"Scraping: {url}")
    try:
        response = requests.get(url, headers=HEADERS, verify=False, timeout=20)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Results are usually in div with class 'box_kqxs'
        boxes = soup.find_all('div', class_='box_kqxs')
        if not boxes:
            # Try finding the content area for Vietlott specifically
            boxes = soup.select('.boxkqxsdientoan')
            
        results = []
        for box in boxes:
            # Extract ID and Date
            # Format: 'Kỳ vé: #01492 | Ngày quay thưởng 03/04/2026'
            header = box.find(lambda tag: tag.name in ['h4', 'div', 'td'] and ('Kỳ' in tag.text or 'Ky' in tag.text))
            if not header: continue
            
            text = header.get_text(separator=' ', strip=True)
            match_id = re.search(r'#?(\d+)', text)
            match_date = re.search(r'(\d{2}/\d{2}/\d{4})', text)
            
            if not match_id or not match_date: continue
            
            draw_id = match_id.group(1).zfill(5)
            draw_date = match_date.group(1)
            
            # Extract Numbers
            # Balls are usually divs with class 'bool' or inside 'result-number' list
            balls = []
            ball_elements = box.find_all('div', class_=re.compile(r'bool|finnish'))
            if not ball_elements:
                ul = box.find('ul', class_='result-number')
                if ul: ball_elements = ul.find_all('li')
                
            for el in ball_elements:
                val = el.get_text(strip=True)
                if val.isdigit():
                    balls.append(val.zfill(2))
            
            if len(balls) < 6: continue
            
            # Format for Google Sheet
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
            
        return results
    except Exception as e:
        print(f"Error scraping {url}: {e}")
        return []

def update_worksheet(worksheet, results):
    """Appends multiple results to the worksheet, skipping existing ones."""
    if not results: return
    
    # Sort results by ID ascending so we append chronologically
    results.sort(key=lambda x: x['draw_id'])
    
    # Get existing IDs to avoid duplicates
    existing_records = worksheet.get_all_values()
    if not existing_records:
        worksheet.append_row(["Kỳ QSMT / Ngày", "Số 1", "Số 2", "Số 3", "Số 4", "Số 5", "Số 6", "Số Đặc Biệt", "Ngày Cào"])
        existing_ids = set()
    else:
        # ID is usually index 0 in the row, e.g. "Kỳ 01492 | 03/04/2026"
        existing_ids = set()
        for row in existing_records:
            if not row or not row[0]:  # Skip empty rows
                continue
            match = re.search(r'(\d+)', row[0])
            if match:
                existing_ids.add(match.group(1).zfill(5))

    added_count = 0
    for data in results:
        did = data['draw_id']
        if did in existing_ids:
            continue
            
        row = [data['draw_info']] + data['numbers'] + [data['special'], data['scraped_at']]
        worksheet.append_row(row)
        print(f"Added {data['draw_info']}")
        added_count += 1
        time.sleep(1) # Be gentle to Google API
        
    if added_count == 0:
        print("No new data to add.")
    else:
        print(f"Total new records added: {added_count}")

def main():
    print(f"Starting Scraper at {datetime.now()}")
    sheet = get_google_sheet()
    
    for game, url in URLS.items():
        print(f"\n--- Processing {game} ---")
        try:
            worksheet = sheet.worksheet(game)
            
            # 1. Scrape latest page
            results = scrape_minhngoc_page(url)
            
            # 2. Backfill check: Minh Ngọc history search if needed
            # For this simplified version, we just scrape the latest page 
            # which usually contains the last ~5-10 draws.
            # If more is needed, we can crawl history URLs.
            
            update_worksheet(worksheet, results)
        except Exception as e:
            print(f"Failed to process {game}: {e}")

if __name__ == "__main__":
    main()
