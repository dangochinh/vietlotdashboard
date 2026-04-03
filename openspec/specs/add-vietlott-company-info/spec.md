# Spec: Vietlott Company Info Dashboard Integration

Xác định yêu cầu chức năng và kỹ thuật cho tính năng hiển thị thông tin công ty Vietlott.

## Requirements

### Functional Requirements
- **Nút Header**: Phải có một nút "Vietlott" trong component Header.
- **Icon**: Sử dụng icon `Building2` từ thư viện `lucide-react`.
- **Hành động**: Khi click vào nút, một modal sẽ hiển thị thông tin chi tiết.
- **Modal Content**:
    - Thông tin tổng quan về Vietlott (tên ví dụ, ngày thành lập).
    - Địa chỉ trụ sở chính (Phan Chu Trinh, Hoàn Kiếm, Hà Nội).
    - Danh sách sản phẩm xổ số chính (Mega 6/45, Power 6/55, Keno, Max 3D).
    - Tuyên bố về trách nhiệm xã hội và đóng góp vào ngân sách nhà nước.
    - Nút đóng (X) và khả năng đóng khi click vào overlay.

### Non-Functional Requirements
- **Hiệu năng**: Modal không được làm chậm quá trình tải trang dashboard.
- **Responsive**: Giao diện modal phải hiển thị tốt trên cả mobile và desktop.
- **Accessibility**: Nút bấm phải có `aria-label` phù hợp.

## Data Definition
Dữ liệu sẽ được lưu trữ tĩnh (static) trong component để đảm bảo tính sẵn sàng cao mà không cần truy vấn API bên ngoài.

## Implementation Details
- Component: `CompanyModal.js`
- Parent: `page.js`
- Toggle: Managed by `useState` in `page.js`.
