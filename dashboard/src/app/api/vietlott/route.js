import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export const dynamic = 'force-dynamic';

async function getGoogleAuth() {
    let credentials;

    if (process.env.GOOGLE_CREDENTIALS) {
        credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    } else {
        const credsPath = path.join(process.cwd(), '../scraper/credentials.json');
        if (fs.existsSync(credsPath)) {
            credentials = JSON.parse(fs.readFileSync(credsPath, 'utf8'));
        } else {
            throw new Error('No Google Credentials found. Set GOOGLE_CREDENTIALS env var or place credentials.json in scraper folder.');
        }
    }

    return new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'Mega645';

        const spreadsheetId = process.env.GOOGLE_SHEET_ID || '1rkURU2bHuhgtf1k5uIzfG7sH8vQQ0VyaSra6M9WTo18';

        const auth = await getGoogleAuth();
        const sheets = google.sheets({ version: 'v4', auth });

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${type}!A:I`,
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) {
            return NextResponse.json({ success: true, data: [] });
        }

        let dataStartIndex = 1;
        let headers = rows[0];

        if (!headers.includes("Kỳ QSMT / Ngày")) {
            headers = ["Kỳ QSMT / Ngày", "Số 1", "Số 2", "Số 3", "Số 4", "Số 5", "Số 6", "Số Đặc Biệt", "Ngày Cào"];
            if (rows[0][0] && rows[0][0].includes("Kỳ")) {
                dataStartIndex = 0;
            }
        }

        const data = rows.slice(dataStartIndex).map((row) => {
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = row[index] || '';
            });
            return obj;
        });

        const recentData = data.reverse();

        return NextResponse.json({ success: true, data: recentData });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch lottery data. Please try again later.' }, { status: 500 });
    }
}
