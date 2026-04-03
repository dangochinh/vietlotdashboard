# Tasks: Thêm button thông tin Vietlott

Bảng công việc triển khai tính năng hiển thị thông tin chi tiết về Vietlott.

## Giao diện & Components
- [x] 1.1 Tạo component `dashboard/src/app/components/CompanyModal.js`
- [x] 1.2 Thiết kế layout modal 2 cột (Desktop) và 1 cột (Mobile)
- [x] 1.3 Tích hợp các nội dung tĩnh về Vietlott (Trụ sở, Sản phẩm, Trách nhiệm)

## Header Integration
- [x] 2.1 Thêm nút "Vietlott" vào `dashboard/src/app/components/Header.js`
- [x] 2.2 Tích hợp icon `Building2` từ `lucide-react`
- [x] 2.3 Liên kết sự kiện click với hàm mở modal

## Logic & State
- [x] 3.1 Khai báo state `companyModalOpen` trong `dashboard/src/app/page.js`
- [x] 3.2 Truyền callback `onCompanyOpen` xuống Header
- [x] 3.3 Render `CompanyModal` trong cây DOM với prop `isOpen` và `onClose`

## Verification
- [x] 4.1 Kiểm tra đóng/mở modal mượt mà
- [x] 4.2 Kiểm tra khả năng tương thích (Responsive) trên Mobile
