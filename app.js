const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Cấu hình CORS để giao diện HTML kết nối được API
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(express.json());

// API trả về danh sách phiếu bảo hành
app.get('/api/tickets', (req, res) => {
    // Lấy từ khóa tìm kiếm từ Client gửi lên
    const searchQuery = (req.query.q || '').trim().toLowerCase();

    const allTickets = [
        { id: 'TK-01', customer_name: 'Trần Tuấn Kiệt', serial_number: 'SN123456', status: 'In-Warranty' },
        { id: 'TK-02', customer_name: 'Nguyen Van A', serial_number: 'SN987654', status: 'Out-of-Warranty' }
    ];

    // Nếu không nhập từ khóa tìm kiếm -> Trả về tất cả dữ liệu
    if (!searchQuery) {
        return res.json(allTickets);
    }

    // Lọc dữ liệu theo từ khóa nhập vào
    const filteredTickets = allTickets.filter(ticket => 
        ticket.id.toLowerCase().includes(searchQuery) ||
        ticket.customer_name.toLowerCase().includes(searchQuery) ||
        ticket.serial_number.toLowerCase().includes(searchQuery)
    );

    // Trả về kết quả lọc (Nếu gõ chữ không khớp như KHONGCO123 thì sẽ trả về mảng rỗng [])
    res.json(filteredTickets);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});