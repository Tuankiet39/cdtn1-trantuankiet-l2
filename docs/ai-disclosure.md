# BẢNG KHAI BÁO SỬ DỤNG CÔNG CỤ AI HỖ TRỢ
**Học phần:** Chuyên đề Tốt nghiệp 1 (Specialized Graduation Topic I)  
**Học kỳ:** HK1, Năm học 2026 – 2027  
**Bài nộp:** [ ] Bài tập 1 (BT1)   [ ] Bài tập 2 (BT2)   [x] Bài tập 3 (BT3)

---

### I. THÔNG TIN SINH VIÊN
* **Họ và tên:** Trần Tuấn Kiệt
* **Mã số sinh viên:** 2374802010263
* **Chuyên ngành (Track):** [x] SE   [ ] DA   [ ] AI
* **Luồng nghiệp vụ đã chọn:** L2 – Tiếp nhận và phân loại yêu cầu bảo hành

---

### II. BẢNG KHAI BÁO CHI TIẾT

| Công cụ AI | Dùng vào việc gì | Áp dụng ở phần nào (File / Mục) | Đã kiểm chứng & Chỉnh sửa thế nào |
| :--- | :--- | :--- | :--- |
| **Gemini** | Hướng dẫn tạo cấu trúc thư mục dự án Node.js và tạo endpoint health check | `app.js`, `src/index.js`, `.gitignore`, `.env.example` | Đã chạy thử server local, kiểm tra truy cập route `/health` trên trình duyệt hoạt động thành công và chụp minh chứng. |
| **Gemini** | Soát lỗi chính tả, chuẩn hóa cấu trúc Markdown và định dạng file README/SRS | `README.md`, `docs/srs.md` | Đã đọc soát lại toàn bộ văn bản, chỉnh sửa chính xác thông tin sinh viên và thông tin luồng nghiệp vụ L2. |
| **Copilot SDK in VS Code** | Hỗ trợ rà soát luồng L2, nối route/service/repository, bổ sung kiểm thử unit/API, đóng gói Docker và soạn tài liệu BT3 | `app.js`, `src/`, `tests/`, `Dockerfile`, `docker-compose.yml`, `seeds/001_sample_data.sql`, `docs/test-plan.md`, `docs/test-report.md`, `docs/bug-log.md`, `docs/deployment-guide.md`, `docs/checklist-bao-mat.md`, `docs/api-contract.md` | Đã chạy `npm test -- --runInBand`: 12/12 test PASS. Đã xác minh Docker Compose có API và MySQL healthy; `/health` trả HTTP 200; `/api/tickets` đọc được hai bản ghi MySQL. Đã sửa seed để tên tiếng Việt được lưu/hiển thị đúng UTF-8. Bộ test tự động vẫn dùng repository giả lập, không phải kiểm thử tích hợp DB. Sinh viên cần tự đọc, kiểm tra và chịu trách nhiệm về toàn bộ nội dung trước khi nộp. |

*Ghi chú:*
- Nếu ở bài nộp này sinh viên **hoàn toàn không sử dụng bất kỳ công cụ AI nào**, hãy ghi rõ `Không sử dụng công cụ AI` vào bảng.

### III. CAM KẾT VỀ LIÊM CHÍNH HỌC THUẬT

> **"Tôi xác nhận đã đọc, hiểu và chịu trách nhiệm về toàn bộ nội dung nộp."**

* **Chữ ký / Họ tên sinh viên:** Trần Tuấn Kiệt  
* **Ngày khai báo:** 13/11/2026