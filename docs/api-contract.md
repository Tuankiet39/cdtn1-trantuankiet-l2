# SMART CRM - MEKONG MOBILE
## API CONTRACT SPECIFICATION (SOFTWARE ENGINEERING TRACK)
**Bài tập:** Bài tập 1 - Phân tích và Thiết kế Systems
**Luồng nghiệp vụ:** Luồng L2 - Xử lý / Quản lý đơn hàng (Order Management)
**Sinh viên thực hiện:** Trần Tuấn Kiệt
**MSSV:** 2374802010263
**Track chuyên ngành:** Software Engineering (SE)

---

## 1. TỔNG QUAN DANH SÁCH ENDPOINTS (SUMMARY)

| STT | Phương thức (HTTP) | Đường dẫn Endpoint | Mục đích / Chức năng | User Story / Use Case | Status Code chính |
| :-: | :---: | :--- | :--- | :--- | :--- |
| 1 | `POST` | `/api/v1/orders` | Tạo đơn hàng mới từ giỏ hàng & trừ tồn kho (Stock) | US1 / UC1 | 201, 400, 409, 500 |
| 2 | `GET` | `/api/v1/orders` | Tra cứu danh sách đơn hàng (Lọc theo OrderStatus) | US4 / UC4 | 200, 400, 500 |
| 3 | `GET` | `/api/v1/orders/{order_id}` | Xem chi tiết thông tin đơn hàng & danh sách OrderItem | US5 / UC4 | 200, 404, 500 |
| 4 | `PUT` | `/api/v1/orders/{order_id}/status` | Nhân viên xác nhận/chuyển trạng thái đơn hàng | US2 / UC2 | 200, 400, 404, 409 |
| 5 | `POST` | `/api/v1/orders/{order_id}/cancel` | Khách hàng hủy đơn hàng Pending & hoàn Stock | US3 / UC3 | 200, 400, 404, 409 |
| 6 | `GET` | `/api/v1/products/{product_id}/stock` | Kiểm tra số lượng tồn kho khả dụng của sản phẩm | BR2 / UC1 | 200, 404, 500 |

---

## 2. ĐẶC TẢ CHI TIẾT TỪNG ENDPOINT

### 2.1. POST /api/v1/orders
- **Mục đích:** Khách hàng đặt mua hàng từ giỏ hàng. Hệ thống khởi tạo bản ghi `Orders`, `OrderItems` và tự động trừ số lượng `Stock` sản phẩm.
- **Quy tắc Validation:**
  * `user_id`: Bắt buộc, kiểu Integer (> 0), tài khoản phải tồn tại trong bảng `Users`.
  * `items`: Bắt buộc, mảng (Array) có từ 1 phần tử trở lên.
  * `items[].product_id`: Bắt buộc, kiểu Integer, sản phẩm phải tồn tại.
  * `items[].quantity`: Bắt buộc, kiểu Integer (> 0).
  * `items[].unit_price`: Bắt buộc, kiểu Decimal/Float (> 0).

#### Request Example (JSON Body):
```json
{
  "user_id": 1,
  "items": [
    {
      "product_id": 101,
      "quantity": 2,
      "unit_price": 15000000.00
    },
    {
      "product_id": 102,
      "quantity": 1,
      "unit_price": 5000000.00
    }
  ]
}
{
  "status": "success",
  "code": 201,
  "message": "Tạo đơn hàng thành công",
  "data": {
    "order_id": 501,
    "user_id": 1,
    "total_amount": 35000000.00,
    "order_status": "Pending",
    "created_at": "2026-10-10T09:30:00Z",
    "items_count": 2
  }
}
{
  "status": "error",
  "code": "OUT_OF_STOCK",
  "message": "Sản phẩm [iPhone 15 Pro] không đủ số lượng tồn kho khả dụng (Tồn kho còn: 1, Đặt: 2)"
}
{
  "status": "error",
  "code": "OUT_OF_STOCK",
  "message": "Sản phẩm [iPhone 15 Pro] không đủ số lượng tồn kho khả dụng (Tồn kho còn: 1, Đặt: 2)"
}
{
  "status": "success",
  "code": 200,
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_items": 45,
    "limit": 10
  },
  "data": [
    {
      "order_id": 501,
      "full_name": "Trần Tuấn Kiệt",
      "total_amount": 35000000.00,
      "order_status": "Pending",
      "created_at": "2026-10-10T09:30:00Z"
    },
    {
      "order_id": 500,
      "full_name": "Nguyễn Văn A",
      "total_amount": 12000000.00,
      "order_status": "Pending",
      "created_at": "2026-10-10T09:15:00Z"
    }
  ]
}
{
  "status": "success",
  "code": 200,
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_items": 45,
    "limit": 10
  },
  "data": [
    {
      "order_id": 501,
      "full_name": "Trần Tuấn Kiệt",
      "total_amount": 35000000.00,
      "order_status": "Pending",
      "created_at": "2026-10-10T09:30:00Z"
    },
    {
      "order_id": 500,
      "full_name": "Nguyễn Văn A",
      "total_amount": 12000000.00,
      "order_status": "Pending",
      "created_at": "2026-10-10T09:15:00Z"
    }
  ]
}
{
  "status": "success",
  "code": 200,
  "data": {
    "order_id": 501,
    "user": {
      "user_id": 1,
      "full_name": "Trần Tuấn Kiệt",
      "email": "tuankiet@gmail.com"
    },
    "total_amount": 35000000.00,
    "order_status": "Pending",
    "created_at": "2026-10-10T09:30:00Z",
    "items": [
      {
        "item_id": 1001,
        "product_id": 101,
        "product_name": "iPhone 15 Pro",
        "quantity": 2,
        "unit_price": 15000000.00
      },
      {
        "item_id": 1002,
        "product_id": 102,
        "product_name": "Tai nghe AirPods Pro",
        "quantity": 1,
        "unit_price": 5000000.00
      }
    ]
  }
}
{
  "status": "error",
  "code": "ORDER_NOT_FOUND",
  "message": "Không tìm thấy đơn hàng với ID: 999"
}
{
  "new_status": "Confirmed",
  "note": "Đơn hàng đã kiểm tra thông tin hợp lệ, chuyển qua khâu đóng gói"
}
{
  "status": "success",
  "code": 200,
  "message": "Cập nhật trạng thái đơn hàng thành công",
  "data": {
    "order_id": 501,
    "previous_status": "Pending",
    "current_status": "Confirmed",
    "updated_at": "2026-10-10T09:45:00Z"
  }
}
{
  "status": "error",
  "code": "INVALID_STATUS_TRANSITION",
  "message": "Không thể chuyển trạng thái từ Cancelled sang Confirmed"
}
{
  "user_id": 1,
  "reason": "Đổi ý không muốn mua nữa"
}
{
  "user_id": 1,
  "reason": "Đổi ý không muốn mua nữa"
}
{
  "status": "error",
  "code": "CANCEL_NOT_ALLOWED",
  "message": "Đơn hàng đã qua khâu xử lý (Confirmed), không thể tự hủy trên hệ thống"
}
{
  "status": "success",
  "code": 200,
  "data": {
    "product_id": 101,
    "product_name": "iPhone 15 Pro",
    "available_stock": 25,
    "is_available": true
  }
}