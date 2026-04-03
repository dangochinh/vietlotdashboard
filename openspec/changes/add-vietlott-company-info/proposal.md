# Proposal: Thêm thông tin chi tiết về Vietlott

Bổ sung nút truy cập và modal hiển thị thông tin chi tiết về Công ty TNHH MTV Xổ số điện toán Việt Nam (Vietlott) nhằm cung cấp bối cảnh đầy đủ cho người dùng về đơn vị phát hành và các sản phẩm của họ.

## Motivation
Hiện tại, dashboard tập trung vào phân tích dữ liệu nhưng chưa cung cấp thông tin nền tảng về Vietlott. Việc bổ sung thông tin này giúp người dùng:
- Hiểu rõ hơn về sự minh bạch và tính pháp lý của Vietlott.
- Dễ dàng tra cứu các sản phẩm khác của công ty (Mega, Power, Keno, Max 3D).
- Nhận thức được đóng góp của Vietlott cho các hoạt động phúc lợi xã hội.

## Proposed Changes
- **Header**: Thêm một button "Vietlott" với icon `Building2` từ Lucide React. Nút này sẽ được đặt cạnh nút "Giới Thiệu".
- **Modal**: Tạo component `CompanyModal` để hiển thị các thông tin:
    - Trụ sở chính và thông tin thành lập.
    - Danh mục sản phẩm lottery.
    - Sứ mệnh và trách nhiệm xã hội.
    - Link website chính thức (vietlott.vn).

## Impact
- **UI/UX**: Thêm một entry point mới trên header, không ảnh hưởng đến luồng phân tích dữ liệu chính.
- **Dependencies**: Sử dụng thư viện `lucide-react` hiện có.
- **Data**: Thông tin tĩnh, không cần gọi API ngoài (tránh phụ thuộc vào downtime của trang chủ).
