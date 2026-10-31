INSERT INTO Users (user_id, full_name, email) VALUES
(1, 'Trần Tuấn Kiệt', 'tuankiet@gmail.com'),
(2, 'Nguyễn Văn A', 'nguyenvana@gmail.com')
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

INSERT INTO Products (product_id, product_name, price, stock) VALUES
(101, 'iPhone 15 Pro', 15000000.00, 10),
(102, 'Tai nghe AirPods Pro', 5000000.00, 5)
ON DUPLICATE KEY UPDATE stock=VALUES(stock);