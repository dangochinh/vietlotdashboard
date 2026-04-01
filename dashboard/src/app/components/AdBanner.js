'use client';

import { useEffect, useRef } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Affiliate banner data  (hoạt động ngay, không cần account)
// Chỉnh href / label / sub tuỳ ý
// ─────────────────────────────────────────────────────────────────────────────
const AFFILIATE_BANNERS = [
  {
    id: 'vietlott-official',
    href: 'https://vietlott.vn',
    label: '🎰 Mua Vé Vietlott Online',
    sub: 'Chính thức từ Vietlott.vn — An toàn & Bảo mật',
    badge: 'CHÍNH THỨC',
    badgeColor: 'from-emerald-500 to-teal-600',
    accent: 'from-teal-500/20 to-emerald-500/10',
    cta: 'Mua Vé Ngay →',
    ctaStyle: 'from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500',
  },
  {
    id: 'vietlott-app',
    href: 'https://vietlott.vn/vi/tin-tuc/tin-vietlott/ung-dung-my-vietlott',
    label: '📱 App My Vietlott',
    sub: 'Quản lý vé số, tra cứu kết quả mọi lúc mọi nơi',
    badge: 'TẢI MIỄN PHÍ',
    badgeColor: 'from-violet-500 to-purple-600',
    accent: 'from-purple-500/20 to-violet-500/10',
    cta: 'Tải App →',
    ctaStyle: 'from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500',
  },
  {
    id: 'vietlott-result',
    href: 'https://vietlott.vn/vi/trung-thuong/ket-qua-trung-thuong',
    label: '🏆 Kết Quả Xổ Số Mới Nhất',
    sub: 'Kiểm tra kết quả trực tiếp từ Vietlott ngay sau mỗi kỳ quay',
    badge: 'LIVE',
    badgeColor: 'from-red-500 to-rose-600',
    accent: 'from-amber-500/20 to-orange-500/10',
    cta: 'Xem Kết Quả →',
    ctaStyle: 'from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Google AdSense Unit (chờ account được duyệt)
// ─────────────────────────────────────────────────────────────────────────────
function AdsenseUnit({ slot, format }) {
  const ref = useRef(null);
  useEffect(() => {
    try {
      if (ref.current && ref.current.offsetWidth > 0) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      // AdSense not loaded yet
    }
  }, []);
  return (
    <div ref={ref} className="overflow-hidden text-center">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format === 'leaderboard' ? 'horizontal' : 'rectangle'}
        data-full-width-responsive="true"
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Affiliate Banner (horizontal leaderboard style)
// ─────────────────────────────────────────────────────────────────────────────
function AffiliateBanner({ bannerIndex = 0 }) {
  const b = AFFILIATE_BANNERS[bannerIndex % AFFILIATE_BANNERS.length];
  return (
    <a
      href={b.href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`
        group w-full flex items-center justify-between gap-4
        bg-gradient-to-r ${b.accent} border border-gray-700/60
        rounded-2xl px-5 py-3.5 transition-all duration-300
        hover:border-gray-500 hover:shadow-lg hover:shadow-black/30
        hover:scale-[1.01] active:scale-[0.99] cursor-pointer
      `}
      aria-label={b.label}
    >
      {/* Badge + Text */}
      <div className="flex items-center gap-3 min-w-0">
        <span
          className={`
            shrink-0 text-[9px] font-black tracking-widest uppercase
            bg-gradient-to-r ${b.badgeColor} text-white
            px-2 py-0.5 rounded-full shadow-sm
          `}
        >
          {b.badge}
        </span>
        <div className="min-w-0">
          <p className="text-white font-bold text-sm leading-tight truncate">
            {b.label}
          </p>
          <p className="text-gray-400 text-xs mt-0.5 truncate hidden sm:block">
            {b.sub}
          </p>
        </div>
      </div>

      {/* CTA Button */}
      <button
        className={`
          shrink-0 text-xs font-bold text-white
          bg-gradient-to-r ${b.ctaStyle}
          px-4 py-2 rounded-xl transition-all shadow-md
          group-hover:shadow-lg whitespace-nowrap
        `}
      >
        {b.cta}
      </button>
    </a>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Public Component: <AdBanner position="top|mid|bottom" />
//
//  • adsEnabled = true  → hiển thị Google AdSense unit thật
//  • adsEnabled = false → hiển thị Affiliate banner (hoạt động ngay)
//
//  position dùng để chọn đúng AdSense slot & affiliate banner index
// ─────────────────────────────────────────────────────────────────────────────
const SLOT_MAP = {
  top: process.env.NEXT_PUBLIC_AD_SLOT_TOP,
  mid: process.env.NEXT_PUBLIC_AD_SLOT_MID,
  bottom: process.env.NEXT_PUBLIC_AD_SLOT_BOT,
};
const BANNER_INDEX_MAP = { top: 0, mid: 1, bottom: 2 };

export default function AdBanner({ position = 'top', className = '' }) {
  const adsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === 'true';
  const slot = SLOT_MAP[position] || SLOT_MAP.top;
  const bannerIndex = BANNER_INDEX_MAP[position] ?? 0;

  return (
    <div className={`w-full ${className}`} aria-label="Quảng cáo">
      {/* Small "Tài trợ" label */}
      <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest text-right mb-1 pr-1">
        Tài trợ
      </p>

      {adsEnabled ? (
        <AdsenseUnit slot={slot} format="leaderboard" />
      ) : (
        <AffiliateBanner bannerIndex={bannerIndex} />
      )}
    </div>
  );
}
