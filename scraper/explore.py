import requests
from bs4 import BeautifulSoup
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def test_minhngoc(url):
    print(f"\n--- Fetching {url} ---")
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    }
    
    try:
        response = requests.get(url, headers=headers, verify=False, timeout=10)
        print(f"Status: {response.status_code}")
        
        soup = BeautifulSoup(response.text, 'html.parser')
        print(f"Title: {soup.title.string if soup.title else 'No Title'}")
        
        # Look for draw date and numbers
        # Minh ngoc tables usually have class 'box_kqxs'
        table = soup.find(class_='box_kqxs')
        if table:
            title = table.find(class_='title')
            print("Draw title:", title.text.strip() if title else "No title element")
            
            # The numbers are often in li elements or specific spans
            numbers = table.find_all('li')
            for idx, num in enumerate(numbers[:10]):
                print(f"Ball {idx}:", num.text.strip())
        else:
            print("No box_kqxs found")
            
    except Exception as e:
        print(f"Error fetching {url}: {e}")

if __name__ == "__main__":
    test_minhngoc('https://minhngoc.net.vn/ket-qua-xo-so/dien-toan-vietlott/mega-6x45.html')
    test_minhngoc('https://minhngoc.net.vn/ket-qua-xo-so/dien-toan-vietlott/power-6x55.html')
