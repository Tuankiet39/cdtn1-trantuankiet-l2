# NHẬT KÝ THAY ĐỔI THIẾT KẾ SO VỚI BÀI TẬP 1

1. Thay đổi: Chuyển đổi toàn bộ nghiệp vụ từ mô hình Giỏ hàng - Đơn hàng sang Luồng L2 chuẩn của Mekong Mobile (Tiếp nhận và phân loại yêu cầu bảo hành).
   Vì sao: Cập nhật đúng yêu cầu đề bài và phản hồi góp ý của Giảng viên ở Bài tập 1 (Bảng 9.1).
   Ảnh hưởng tới thành phần nào: Toàn bộ thư mục `src/` (`routes/ticket.routes.js`, `services/ticket.service.js`, `repositories/ticket.repository.js`), `migrations/` và `seeds/`.

2. Thay đổi: Bổ sung chỉ mục UNIQUE cho cột `email` trong bảng `Customers` và số serial trong bảng `Devices`.
   Vì sao: Đảm bảo không trùng lặp thông tin thiết bị/khách hàng khi tiếp nhận phiếu bảo hành và hỗ trợ quy tắc QT-03.
   Ảnh hưởng tới thành phần nào: Tệp `migrations/001_init_schema.sql` và `seeds/001_sample_data.sql`.

3. Thay đổi: Bổ sung sơ đồ ERD (`erd.drawio`) và cập nhật Use Case Diagram ($\ge 5$ use cases) kèm chú thích rõ ràng.
   Vì sao: Khắc phục các thiếu sót về sơ đồ theo đúng nhận xét đánh giá BT1 của Giảng viên.
   Ảnh hưởng tới thành phần nào: Thư mục `docs/` (`erd.drawio`, `usecase.drawio`, `architecture.drawio`).