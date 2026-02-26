import os
import json
from playwright.sync_api import sync_playwright
import gspread
from oauth2client.service_account import ServiceAccountCredentials
from datetime import datetime

# URL config
URLS = {
    'Mega645': 'https://vietlott.vn/vi/trung-thuong/ket-qua-trung-thuong/mega-6-45',
    'Power655': 'https://vietlott.vn/vi/trung-thuong/ket-qua-trung-thuong/power-6-55'
}

def get_google_sheet():
    scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
    creds_path = os.path.join(os.path.dirname(__file__), 'credentials.json')
    
    if not os.path.exists(creds_path):
        # Allow passing creds via env var in GitHub Actions
        creds_env = os.environ.get('GOOGLE_CREDENTIALS')
        if creds_env:
            with open(creds_path, 'w') as f:
                f.write(creds_env)
        else:
            raise FileNotFoundError("credentials.json not found and GOOGLE_CREDENTIALS env var is not set.")
            
    creds = ServiceAccountCredentials.from_json_keyfile_name(creds_path, scope)
    client = gspread.authorize(creds)
    
    # URL provided by user
    sheet_url = "https://docs.google.com/spreadsheets/d/1rkURU2bHuhgtf1k5uIzfG7sH8vQQ0VyaSra6M9WTo18/edit"
    sheet = client.open_by_url(sheet_url)
    return sheet

def scrape_vietlott(url, p):
    print(f"Scraping: {url}")
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(ignore_https_errors=True)
    page = context.new_page()
    
    try:
        page.goto(url, timeout=30000, wait_until="domcontentloaded")
        page.wait_for_selector('.box-ketqua', timeout=10000)
        
        # Extract Draw Date / ID
        draw_info_el = page.query_selector('h5')
        draw_info = draw_info_el.inner_text().strip() if draw_info_el else ""
        
        # Extract Numbers
        balls_el = page.query_selector_all('.bong_tron')
        numbers = [b.inner_text().strip() for b in balls_el if b.inner_text().strip()]
        
        return {
            'draw_info': draw_info,
            'numbers': numbers,
            'scraped_at': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
    except Exception as e:
        print(f"Error scraping {url}: {e}")
        return None
    finally:
        context.close()
        browser.close()

def append_to_sheet(worksheet, data):
    # Retrieve existing records to avoid duplicates based on 'draw_info'
    existing_records = worksheet.get_all_records()
    existing_draws = [str(r.get('Kỳ QSMT / Ngày', '')) for r in existing_records]
    
    # Row format: [Kỳ QSMT / Ngày, Số 1, Số 2, Số 3, Số 4, Số 5, Số 6, Số Đặc Biệt, Ngày Cào]
    draw_info = data['draw_info']
    
    if draw_info in existing_draws and draw_info != "":
        print(f"Data for {draw_info} already exists. Skipping.")
        return
        
    num_balls = data['numbers']
    row = [draw_info] + num_balls
    # If it's Mega, it only has 6 balls. Power has 7.
    # We pad to 7 balls just in case.
    while len(row) < 8:
        row.append("")
        
    row.append(data['scraped_at'])
    
    worksheet.append_row(row)
    print(f"Successfully appended {draw_info} to sheet.")

def main():
    print("Starting Vietlott Scraper...")
    sheet = get_google_sheet()
    
    with sync_playwright() as p:
        for name, url in URLS.items():
            print(f"--- Processing {name} ---")
            data = scrape_vietlott(url, p)
            if data and data['numbers']:
                print(f"Found data: {data}")
                try:
                    worksheet = sheet.worksheet(name)
                    # Initialize headers if empty
                    if len(worksheet.get_all_values()) == 0:
                        worksheet.append_row(["Kỳ QSMT / Ngày", "Số 1", "Số 2", "Số 3", "Số 4", "Số 5", "Số 6", "Số Đặc Biệt", "Ngày Cào"])
                    append_to_sheet(worksheet, data)
                except gspread.exceptions.WorksheetNotFound:
                    print(f"Worksheet '{name}' not found. Please create it.")
            else:
                print(f"Failed to scrape data for {name}")

if __name__ == "__main__":
    main()
