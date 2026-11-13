# NHẬT KÝ THAY ĐỔI THIẾT KẾ SO VỚI BÀI TẬP 1

1. Thay đổi: Chuyển đổi toàn bộ nghiệp vụ từ mô hình Giỏ hàng - Đơn hàng sang Luồng L2 chuẩn của Mekong Mobile (Tiếp nhận và phân loại yêu cầu bảo hành).
   Vì sao: Cập nhật đúng yêu cầu đề bài và phản hồi góp ý của Giảng viên ở Bài tập 1 (Bảng 9.1).
   Ảnh hưởng tới thành phần nào: Toàn bộ thư mục `src/` (`routes/ticket.routes.js`, `services/ticket.service.js`, `repositories/ticket.repository.js`), `migrations/` và `seeds/`.

2. Thay đổi: Bổ sung chỉ mục UNIQUE cho cột `email` trong bảng `Customers` và số serial trong bảng `Devices`.
   Vì sao: Đảm bảo không trùng lặp thông tin thiết bị/khách hàng khi tiếp nhận phiếu bảo hành và hỗ trợ quy tắc QT-03.
   Ảnh hưởng tới thành phần nào: Tệp `migrations/001_init_schema.sql` và `seeds/001_sample_data.sql`.

3. **Giới hạn tài liệu:** Nhật ký cũ có nhắc ERD (`erd.drawio`), nhưng tệp
   này không có trong repo. Các sơ đồ `architecture.drawio` và `usecase.drawio`
   còn nội dung từ luồng đơn hàng; không sử dụng chúng làm minh chứng BT3.

## Thay đổi trong Bài tập 3 (so với Bài tập 2)

1. **Thay đổi:** Nối entry point `app.js` với route, service và MySQL repository
   của luồng L2; bỏ endpoint giả lập Orders và dùng `GET/POST /api/tickets`.
   **Lý do:** Phản hồi BT2 ghi nhận mã nguồn tại `v0.2` chưa chạy được và
   các tệp kiểm chứng cốt lõi còn rỗng. Phần tiếp nhận bảo hành cần chạy qua
   đúng entry point, không chỉ có mã lớp rời rạc.
   **Ảnh hưởng:** `app.js`, `src/index.js`, `src/routes/`,
   `src/services/`, `src/repositories/`, `src/validators/`.

2. **Thay đổi:** Thay schema và dữ liệu mẫu từ Users/Products/Orders sang
   Customers/Devices/Tickets, thêm khóa ngoại và serial/email duy nhất.
   **Lý do:** Đưa database khớp với nghiệp vụ L2 và các truy vấn ticket.
   **Ảnh hưởng:** `migrations/001_init_schema.sql`,
   `seeds/001_sample_data.sql`.

3. **Thay đổi:** Bổ sung 12 unit/API test case, Test Plan, Test Report, Bug Log,
   Deployment Guide, security checklist và tài liệu API tiếng Anh.
   **Lý do:** Đáp ứng các thành phần kiểm thử và bàn giao của Bài tập 3; kết
   quả test ghi theo đúng lần chạy hiện có.
   **Ảnh hưởng:** `tests/`, `docs/test-plan.md`, `docs/test-report.md`,
   `docs/bug-log.md`, `docs/deployment-guide.md`,
   `docs/checklist-bao-mat.md`, `docs/api-contract.md`.

4. **Xác minh:** `npm test -- --runInBand` đạt 12/12. Docker Compose đã chạy
   thực tế: API và MySQL healthy; `/health` trả HTTP 200 và `/api/tickets`
   đọc được hai bản ghi. Automated API tests vẫn dùng repository giả lập.
   Các thay đổi BT3 nằm trong commit local; chúng chưa được push. Tag `v1.0`
   chưa được tạo/publish.

5. **Sửa dữ liệu mẫu:** Khai báo charset `utf8mb4` trong seed để tên tiếng
   Việt được lưu chính xác; đã kiểm tra nhập seed vào schema MySQL trống và
   đọc danh sách từ giao diện Docker đang chạy.