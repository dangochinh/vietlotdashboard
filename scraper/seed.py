import os
import gspread
from oauth2client.service_account import ServiceAccountCredentials

def get_google_sheet():
    scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
    creds_path = os.path.join(os.path.dirname(__file__), 'credentials.json')
    creds = ServiceAccountCredentials.from_json_keyfile_name(creds_path, scope)
    client = gspread.authorize(creds)
    sheet_url = "https://docs.google.com/spreadsheets/d/1rkURU2bHuhgtf1k5uIzfG7sH8vQQ0VyaSra6M9WTo18/edit"
    sheet = client.open_by_url(sheet_url)
    return sheet

def init_headers(worksheet, is_power=False):
    if len(worksheet.get_all_values()) == 0:
        worksheet.append_row(["Kỳ QSMT / Ngày", "Số 1", "Số 2", "Số 3", "Số 4", "Số 5", "Số 6", "Số Đặc Biệt", "Ngày Cào"])

def seed_data():
    sheet = get_google_sheet()
    
    # Check mega
    try:
        mega = sheet.worksheet("Mega645")
        init_headers(mega)
        # Sample data
        existing = mega.get_all_values()
        if len(existing) < 2:
            mega.append_row(["Kỳ 01111 / 25-02-2026", "02", "14", "25", "33", "41", "44", "", "2026-02-26 10:00:00"])
            mega.append_row(["Kỳ 01110 / 22-02-2026", "05", "11", "22", "29", "35", "40", "", "2026-02-26 10:00:00"])
            print("Seeded Mega645")
    except gspread.exceptions.WorksheetNotFound:
        print("Mega645 not found")

    # Check power
    try:
        power = sheet.worksheet("Power655")
        init_headers(power, is_power=True)
        # Sample data
        existing = power.get_all_values()
        if len(existing) < 2:
            power.append_row(["Kỳ 01234 / 24-02-2026", "05", "12", "19", "21", "38", "49", "50", "2026-02-26 10:00:00"])
            power.append_row(["Kỳ 01233 / 21-02-2026", "01", "15", "20", "28", "41", "55", "33", "2026-02-26 10:00:00"])
            print("Seeded Power655")
    except gspread.exceptions.WorksheetNotFound:
        print("Power655 not found")

if __name__ == "__main__":
    seed_data()
