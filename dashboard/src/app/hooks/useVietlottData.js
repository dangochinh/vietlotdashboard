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

    // Last updated from GitHub (repo uses power645.jsonl for Mega645)
    const ghFileName = activeTab === 'Mega645' ? 'power645' : 'power655';
    const { data: commits } = useSWR(
        `https://api.github.com/repos/vietvudanh/vietlott-data/commits?path=data/${ghFileName}.jsonl&page=1&per_page=1`,
        fetcher,
        { revalidateOnFocus: false, dedupingInterval: 600000 } // 10 min cache
    );

    const data = result?.success ? result.data : [];
    const error = result && !result.success ? (result.error || 'Failed to fetch data') : (dataError?.message || null);
    const jackpotData = jackpotResult?.success ? jackpotResult.data : null;

    let lastUpdated = null;
    if (commits && commits.length > 0) {
        const date = new Date(commits[0].commit.author.date);
        lastUpdated = date.toLocaleString('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
    }

    return { data, loading: isLoading, error, jackpotData, lastUpdated };
}
