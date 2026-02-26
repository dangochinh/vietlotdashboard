import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export const dynamic = 'force-dynamic';

const URLS = {
    Mega645: 'https://www.minhngoc.net.vn/ket-qua-xo-so/dien-toan-vietlott/mega-6x45.html',
    Power655: 'https://www.minhngoc.net.vn/ket-qua-xo-so/dien-toan-vietlott/power-6x55.html',
};

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'Mega645';

        const targetUrl = URLS[type] || URLS.Mega645;
        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            next: { revalidate: 300 }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch from minhngoc: ${response.status}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        let jackpot1 = null;
        let jackpot2 = null;

        if (type === 'Mega645') {
            // Find element with id containing DT6X45_G_JACKPOT
            const el = $('[id*="DT6X45_G_JACKPOT"]').first();
            if (el.length) {
                const text = el.text().trim();
                const match = text.match(/[0-9.,]{8,}/);
                if (match) jackpot1 = match[0].replace(/,/g, '.');
            }
        } else {
            // Power 6/55 has JP1 and JP2
            const jp1El = $('[id*="DT6X55_G_JACKPOT"]').not('[id*="JACKPOT2"]').first();
            const jp2El = $('[id*="DT6X55_G_JACKPOT2"]').first();

            if (jp1El.length) {
                const text = jp1El.text().trim();
                const match = text.match(/[0-9.,]{8,}/);
                if (match) jackpot1 = match[0].replace(/,/g, '.');
            }
            if (jp2El.length) {
                const text = jp2El.text().trim();
                const match = text.match(/[0-9.,]{8,}/);
                if (match) jackpot2 = match[0].replace(/,/g, '.');
            }
        }

        if (!jackpot1) {
            return NextResponse.json({ success: false, error: 'Could not parse Jackpot value' });
        }

        return NextResponse.json({
            success: true,
            data: { jackpot1, jackpot2 }
        });

    } catch (error) {
        console.error('Jackpot API Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
