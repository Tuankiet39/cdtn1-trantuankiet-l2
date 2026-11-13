SET NAMES utf8mb4;

INSERT INTO Customers (customer_id, full_name, email) VALUES
(1, 'Trần Tuấn Kiệt', 'tuankiet@gmail.com'),
(2, 'Nguyễn Văn A', 'nguyenvana@gmail.com')
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);

INSERT INTO Devices
  (device_id, customer_id, serial_number, device_name, purchase_date, warranty_months)
VALUES
(1, 1, 'SN123456', 'Mekong Mobile Phone A', DATE_SUB(CURDATE(), INTERVAL 6 MONTH), 12),
(2, 2, 'SN987654', 'Mekong Mobile Phone B', DATE_SUB(CURDATE(), INTERVAL 24 MONTH), 12)
ON DUPLICATE KEY UPDATE
  customer_id = VALUES(customer_id),
  device_name = VALUES(device_name),
  purchase_date = VALUES(purchase_date),
  warranty_months = VALUES(warranty_months);

INSERT INTO Tickets (ticket_id, customer_id, device_id, issue_description, warranty_status, status)
SELECT 1, 1, 1, 'Sample screen issue', 'In-Warranty', 'Received'
WHERE NOT EXISTS (SELECT 1 FROM Tickets WHERE ticket_id = 1);

INSERT INTO Tickets (ticket_id, customer_id, device_id, issue_description, warranty_status, status)
SELECT 2, 2, 2, 'Sample battery issue', 'Out-of-Warranty', 'Received'
WHERE NOT EXISTS (SELECT 1 FROM Tickets WHERE ticket_id = 2);
