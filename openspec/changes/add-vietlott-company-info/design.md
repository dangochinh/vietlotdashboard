# Design: Vietlott Company Info Dashboard Integration

Thiết kế kiến trúc và giao diện cho tính năng hiển thị thông tin Công ty Vietlott.

## Overview
Dự án bổ sung khả năng truy cập thông tin tĩnh về doanh nghiệp trực tiếp từ thanh header của ứng dụng Dashboard.

## Component Design

### 1. `CompanyModal.js`
- Chức năng: Component hiển thị modal thông tin chi tiết.
- Props: `isOpen`, `onClose`.
- Layout: 2 cột trên desktop (Thông tin chính / Sản phẩm & Trách nhiệm).
- Styling: Sử dụng `bg-gray-900`, `border-gray-700`, `backdrop-blur-sm`.
- Icon: Tích hợp `Building2`, `Globe`, `MapPin`, `ShieldCheck`.

### 2. `Header.js` Integration
- Nút mới: "Vietlott".
- Vị trí: Đặt trước hoặc sau nút "Giới Thiệu".
- Sự kiện `onClick`: Gọi prop `onCompanyOpen`.

### 3. State Management (`page.js`)
- State: `companyModalOpen` (boolean).
- Mở: Thông qua `Header`.
- Đóng: Thông qua `CompanyModal` hoặc click ra ngoài.

## Data Flow
Tất cả dữ liệu được lưu trữ trực tiếp trong component `CompanyModal.js` dưới dạng text tĩnh. Điều này giúp tính năng hoạt động ngay cả khi không có kết nối internet hoặc API của Vietlott gặp sự cố.

## UI/UX Considerations
- Tiêu đề modal: "Thông Tin Công Ty Vietlott".
- Sử dụng màu xanh emerald/teal để tạo sự quen thuộc với nhận diện thương hiệu.
- Đảm bảo tính di động cao (Responsive) cho người dùng điện thoại.
- Hiệu ứng chuyển động (transition) mượt mà khi mở/đóng modal.
