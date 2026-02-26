// Draw schedule days (0=Sunday, 1=Monday, etc.)
export const DRAW_DAYS = {
    Mega645: [3, 5, 0],   // Wed, Fri, Sun
    Power655: [2, 4, 6],  // Tue, Thu, Sat
};

export const DRAW_HOUR = 18; // 6 PM Vietnam time

export const CHART_COLORS = {
    frequency: { top: '#10b981', rest: '#0d9488' },
    pairs: { top: '#818cf8', rest: '#6366f1' },
    trios: { top: '#fb7185', rest: '#f43f5e' },
    cold: { top: '#3b82f6', rest: '#2563eb' },
    evenOdd: ['#f97316', '#eab308', '#84cc16', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6'],
    scatter: '#c026d3',
};

export const TOOLTIP_STYLE = {
    contentStyle: { backgroundColor: '#1f2937', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' },
};

export const MAX_NUMBERS = {
    Mega645: 45,
    Power655: 55,
};

// Expected average sum for scatter plot reference
export const EXPECTED_SUM = {
    Mega645: 138,
    Power655: 168,
};
