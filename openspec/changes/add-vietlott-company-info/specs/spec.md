# Spec: Vietlott Company Information Dashboard Integration

Xác định yêu cầu chức năng và kỹ thuật cho tính năng hiển thị thông tin công ty Vietlott.

## Requirements

### Chức năng chính
- Thêm một nút trên header: "Vietlott".
- Khi click vào nút, hiển thị một modal nội dung thông tin về công ty.
- Modal phải hỗ trợ cuộn (scroll) trên màn hình nhỏ.
- Modal phải có nút đóng và hỗ trợ đóng bằng phím Esc hoặc click overlay.

### Thông tin hiển thị
- Tên chính thức: Công ty Trách nhiệm hữu hạn Một thành viên Xổ số điện toán Việt Nam.
- Tên viết tắt/thương hiệu: Vietlott.
- Trụ sở: Tầng 15, Tòa nhà CornerStone, 16 Phan Chu Trinh, Hoàn Kiếm, Hà Nội.
- Sản phẩm chính: Mega 6/45, Power 6/55, Keno, Max 3D.
- Khẩu hiệu: "Cơ hội để tốt hơn".

### Ràng buộc kỹ thuật
- Sử dụng thư viện `lucide-react` cho biểu tượng.
- CSS: Tailwind CSS (theo dashboard hiện tại).
- Hiệu ứng: Chuyển động fade-in/scale tương ứng với thiết kế modal của dự án.
