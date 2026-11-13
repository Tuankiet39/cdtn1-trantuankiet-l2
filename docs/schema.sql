CREATE TABLE IF NOT EXISTS Customers (
    customer_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Devices (
    device_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_id INT UNSIGNED NOT NULL,
    serial_number VARCHAR(100) NOT NULL UNIQUE,
    device_name VARCHAR(150) NOT NULL,
    purchase_date DATE NOT NULL,
    warranty_months SMALLINT UNSIGNED NOT NULL,
    CONSTRAINT fk_devices_customers
      FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

CREATE TABLE IF NOT EXISTS Tickets (
    ticket_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_id INT UNSIGNED NOT NULL,
    device_id INT UNSIGNED NOT NULL,
    issue_description VARCHAR(1000) NOT NULL,
    warranty_status ENUM('In-Warranty', 'Out-of-Warranty') NOT NULL,
    status ENUM('Received', 'In-Progress', 'Resolved', 'Closed') NOT NULL DEFAULT 'Received',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_tickets_created_at (created_at),
    CONSTRAINT fk_tickets_customers
      FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
    CONSTRAINT fk_tickets_devices
      FOREIGN KEY (device_id) REFERENCES Devices(device_id)
);
