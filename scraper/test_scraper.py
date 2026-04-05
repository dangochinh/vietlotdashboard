import requests
from bs4 import BeautifulSoup
import urllib3
import re
from datetime import datetime

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'vi,en;q=0.9',
}

def scrape_minhngoc(url):
    print(f"Scraping {url}...")
    try:
        response = requests.get(url, headers=HEADERS, verify=False, timeout=15)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Minh Ngọc Vietlott results are often in divs with class "box_kqxs" 
        # and inside there's a table with class "bangkqmega" or "bangkq6x36" etc.
        # But latest format seems to lead to a list of results
        
        boxes = soup.find_all('div', class_='box_kqxs')
        if not boxes:
            print("No box_kqxs found. Trying table search...")
            # Fallback for some page variants
            boxes = soup.find_all('table', class_='kj-kqxs')

        results = []
        for box in boxes:
            # 1. Get Date and ID
            # Usually: "Kỳ vé: #01476 | Ngày quay thưởng 25/02/2026"
            info_div = box.find('td', align='center') or box.find('div', class_='titles')
            if not info_div:
                # Try h4 small
                info_div = box.find('h4')
            
            if not info_div: continue
            
            text = info_div.text.strip()
            # Regex to find Ky and Date
            match_id = re.search(r'#(\d+)', text)
            match_date = re.search(r'(\d{2}/\d{2}/\d{4})', text)
            
            if not match_id or not match_date:
                # Try another format "Kỳ 01325 | 28/03/2026"
                match_id = re.search(r'Kỳ\s*(\d+)', text)
            
            if not match_id or not match_date: continue
            
            draw_id = match_id.group(1)
            draw_date = match_date.group(1)
            
            # 2. Get Numbers
            # Usually in <ul class="result-number"> or <div class="bool">
            balls = []
            # Find all divs with class "bool"
            bool_divs = box.find_all('div', class_=re.compile(r'bool'))
            if bool_divs:
                balls = [b.text.strip() for b in bool_divs if b.text.strip().isdigit()]
            else:
                # Try result-number list
                res_ul = box.find('ul', class_='result-number')
                if res_ul:
                    balls = [li.text.strip() for li in res_ul.find_all('li') if li.text.strip().isdigit()]

            if not balls: continue
            
            # Format row: ["Kỳ 01325 | 28/03/2026", "07", "13", "21", "30", "33", "42", "39", "2026-03-31 14:08:28"]
            # Power 6/55 has 7 numbers, Mega 6/45 has 6 numbers.
            # Special ball is 7th in Power.
            
            num_balls = len(balls)
            formatted_balls = [b.zfill(2) for b in balls]
            
            special_ball = ""
            if num_balls > 6:
                special_ball = formatted_balls[6]
                main_balls = formatted_balls[:6]
            else:
                main_balls = formatted_balls
            
            draw_info = f"Kỳ {draw_id.zfill(5)} | {draw_date}"
            
            results.append({
                'draw_id': draw_id,
                'draw_info': draw_info,
                'numbers': main_balls,
                'special': special_ball,
                'date_obj': datetime.strptime(draw_date, '%d/%m/%Y')
            })
            
        return results
    except Exception as e:
        print(f"Scraping error: {e}")
        return []

if __name__ == "__main__":
    mega_results = scrape_minhngoc("https://www.minhngoc.net.vn/ket-qua-xo-so/dien-toan-vietlott/mega-6x45.html")
    print(f"Found {len(mega_results)} Mega results")
    for r in mega_results[:2]: print(r)
    
    power_results = scrape_minhngoc("https://www.minhngoc.net.vn/ket-qua-xo-so/dien-toan-vietlott/power-6x55.html")
    print(f"Found {len(power_results)} Power results")
    for r in power_results[:2]: print(r)
