import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// Helper to get Google Auth
async function getGoogleAuth() {
    let credentials;

    // 1. Try environment variable (for Vercel deployment)
    if (process.env.GOOGLE_CREDENTIALS) {
        credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    } else {
        // 2. Try local file (for local development)
        const credsPath = path.join(process.cwd(), '../scraper/credentials.json');
        if (fs.existsSync(credsPath)) {
            credentials = JSON.parse(fs.readFileSync(credsPath, 'utf8'));
        } else {
            throw new Error('No Google Credentials found. Set GOOGLE_CREDENTIALS env var or place credentials.json in scraper folder.');
        }
    }

    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    return auth;
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'Mega645'; // 'Mega645' or 'Power655'

        // User's Google Sheet ID
        const spreadsheetId = '1rkURU2bHuhgtf1k5uIzfG7sH8vQQ0VyaSra6M9WTo18';

        const auth = await getGoogleAuth();
        const sheets = google.sheets({ version: 'v4', auth });

        // Read all data from the specific sheet
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `${type}!A:I`, // Fetch columns A to I
        });

        const rows = response.data.values;
        if (!rows || rows.length === 0) {
            return NextResponse.json({ success: true, data: [] });
        }

        // Parse Headers
        const headers = rows[0];
        const data = rows.slice(1).map((row) => {
            // row is an array of strings: [Kỳ QSMT / Ngày, Số 1, Số 2, Số 3, Số 4, Số 5, Số 6, Số Đặc Biệt, Ngày Cào]
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = row[index] || '';
            });
            return obj;
        });

        // Reverse data to get latest draws first, and limit to recent 100 draws
        const recentData = data.reverse().slice(0, 100);

        return NextResponse.json({ success: true, data: recentData });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
