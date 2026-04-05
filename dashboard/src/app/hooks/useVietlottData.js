'use client';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then(r => r.json());

export function useVietlottData(activeTab) {
    // Main data from Google Sheets
    const { data: result, error: dataError, isLoading } = useSWR(
        `/api/vietlott?type=${activeTab}`,
        fetcher,
        { revalidateOnFocus: false, dedupingInterval: 300000 } // 5 min cache
    );

    // Jackpot data from MinhNgoc
    const { data: jackpotResult } = useSWR(
        `/api/jackpot?type=${activeTab}`,
        fetcher,
        { revalidateOnFocus: false, dedupingInterval: 300000 }
    );

    const data = result?.success ? result.data : [];
    const error = result && !result.success ? (result.error || 'Failed to fetch data') : (dataError?.message || null);
    const jackpotData = jackpotResult?.success ? jackpotResult.data : null;

    let lastUpdated = null;
    if (data && data.length > 0) {
        // Use the 'Ngày Cào' field from the latest record as the updated timestamp
        const latestRecord = data[0]; // Data is already reversed in API
        if (latestRecord['Ngày Cào']) {
            const rawDate = latestRecord['Ngày Cào'];
            // Try to format YYYY-MM-DD HH:mm:ss to HH:mm:ss DD/MM/YYYY
            const match = rawDate.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}:\d{2}:\d{2})$/);
            if (match) {
                const [_, y, m, d, t] = match;
                lastUpdated = `${t} ${d}/${m}/${y}`;
            } else {
                lastUpdated = rawDate;
            }
        }
    }

    return { data, loading: isLoading, error, jackpotData, lastUpdated };
}
