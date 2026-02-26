'use client';
import { useState, useEffect, useCallback } from 'react';
import { DRAW_DAYS, DRAW_HOUR } from '../lib/constants';

function calculate(activeTab) {
    const now = new Date();
    const vnTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));
    const drawDays = DRAW_DAYS[activeTab] || DRAW_DAYS.Mega645;
    const currentDay = vnTime.getDay();
    const currentHour = vnTime.getHours();

    let daysToAdd = 0;
    if (drawDays.includes(currentDay) && currentHour < DRAW_HOUR) {
        daysToAdd = 0;
    } else {
        daysToAdd = 1;
        while (!drawDays.includes((currentDay + daysToAdd) % 7)) {
            daysToAdd++;
        }
    }

    const targetVnDate = new Date(vnTime);
    targetVnDate.setDate(targetVnDate.getDate() + daysToAdd);
    targetVnDate.setHours(DRAW_HOUR, 0, 0, 0);

    const diffMs = targetVnDate.getTime() - vnTime.getTime();
    if (diffMs <= 0) return 'Đang Xổ';

    const h = Math.floor(diffMs / (1000 * 60 * 60));
    const m = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diffMs % (1000 * 60)) / 1000);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function useCountdown(activeTab) {
    const [countdown, setCountdown] = useState(() => calculate(activeTab));

    useEffect(() => {
        const timer = setInterval(() => setCountdown(calculate(activeTab)), 1000);
        return () => clearInterval(timer);
    }, [activeTab]);

    return countdown;
}
