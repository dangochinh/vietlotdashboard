import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'Mega645'; // 'Mega645' or 'Power655'

        const targetUrl = type === 'Mega645'
            ? 'https://www.minhngoc.net.vn/ket-qua-xo-so/dien-toan-vietlott/mega-6x45.html'
            : 'https://www.minhngoc.net.vn/ket-qua-xo-so/dien-toan-vietlott/power-6x55.html';

        const response = await fetch(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            next: { revalidate: 300 } // Cache for 5 minutes
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch from minhngoc: ${response.status}`);
        }

        const html = await response.text();

        // Parse Jackpot 1 or general Jackpot
        let jackpot1 = null;
        let jackpot2 = null;

        if (type === 'Mega645') {
            const megaMatch = /Jackpot[^\d]+([0-9.,]{8,})/i.exec(html);
            if (megaMatch) {
                jackpot1 = megaMatch[1].replace(/,/g, '.'); // Format to standard dots for billions
            }
        } else {
            const jp1Match = /Jackpot\s*1[^\d]+([0-9.,]{8,})/i.exec(html);
            const jp2Match = /Jackpot\s*2[^\d]+([0-9.,]{8,})/i.exec(html);

            if (jp1Match) jackpot1 = jp1Match[1].replace(/,/g, '.');
            if (jp2Match) jackpot2 = jp2Match[1].replace(/,/g, '.');
        }

        if (!jackpot1) {
            return NextResponse.json({ success: false, error: 'Could not parse Jackpot value' });
        }

        return NextResponse.json({
            success: true,
            data: {
                jackpot1,
                jackpot2
            }
        });

    } catch (error) {
        console.error('Jackpot API Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
