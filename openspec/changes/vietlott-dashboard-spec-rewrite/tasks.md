# Tasks: Vietlott Dashboard Spec Rewrite

> **Mục tiêu**: Scan toàn bộ codebase và viết lại spec hoàn chỉnh phản ánh trạng thái hiện tại của dự án.
> Đây là tác vụ **documentation**, không phải feature implementation.

---

## Phase 1: Research & Scan

- [x] Scan cấu trúc thư mục toàn bộ dự án
- [x] Đọc `dashboard/package.json` — xác định tech stack, dependencies
- [x] Đọc `dashboard/src/app/page.js` — hiểu Dashboard chính
- [x] Đọc `dashboard/src/app/predict/page.js` — hiểu Predict page
- [x] Đọc tất cả components trong `components/`
- [x] Đọc `hooks/useVietlottData.js` + `hooks/useCountdown.js`
- [x] Đọc `lib/constants.js` + `lib/prediction.js`
- [x] Đọc `api/vietlott/route.js` + `api/jackpot/route.js`
- [x] Đọc `scraper/main.py`
- [x] Đọc `.github/workflows/scraper.yml`
- [x] Đọc `dashboard/src/app/layout.js`
- [x] Đọc `openspec/config.yaml`

---

## Phase 2: Write Spec Artifacts

- [x] Tạo OpenSpec change `vietlott-dashboard-spec-rewrite`
- [x] Viết `proposal.md` — tổng quan dự án, mục tiêu, phạm vi, non-goals
- [x] Viết `design.md` — design system, component design specs
- [x] Viết `specs/scraper.md` — scraper module spec
- [x] Viết `specs/api-routes.md` — API routes spec
- [x] Viết `specs/dashboard.md` — Dashboard page & components spec
- [x] Viết `specs/prediction.md` — Prediction system spec
- [x] Viết `specs/infrastructure.md` — Infrastructure & deployment spec
- [x] Viết `tasks.md` (file này)

---

## Kết Quả

Toàn bộ spec đã được viết và lưu tại:

```
openspec/changes/vietlott-dashboard-spec-rewrite/
├── proposal.md           # Tổng quan dự án
├── design.md             # Design system & component specs
├── tasks.md              # File này
└── specs/
    ├── scraper.md        # Python scraper module
    ├── api-routes.md     # Next.js API routes
    ├── dashboard.md      # Dashboard page & all components
    ├── prediction.md     # Prediction algorithms & page
    └── infrastructure.md # Deployment, env vars, project structure
```

**Trạng thái**: ✅ Hoàn thành — 9/9 tasks done.
