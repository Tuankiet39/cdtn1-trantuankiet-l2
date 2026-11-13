class TicketRepository {
  constructor(dbPool) {
    this.db = dbPool;
  }

  async listTickets(query = '') {
    const search = `%${query}%`;
    const [rows] = await this.db.query(
      `SELECT t.ticket_id AS id, c.full_name AS customer_name,
              d.serial_number, t.warranty_status AS status
       FROM Tickets t
       JOIN Customers c ON c.customer_id = t.customer_id
       JOIN Devices d ON d.device_id = t.device_id
       WHERE (? = '' OR CAST(t.ticket_id AS CHAR) LIKE ?
              OR d.serial_number LIKE ? OR c.full_name LIKE ?)
       ORDER BY t.created_at DESC, t.ticket_id DESC`,
      [query, search, search, search]
    );
    return rows;
  }

  async findDeviceWithOwner(deviceId, customerId) {
    const [rows] = await this.db.query(
      `SELECT d.device_id, d.purchase_date, d.warranty_months
       FROM Devices d
       WHERE d.device_id = ? AND d.customer_id = ?`,
      [deviceId, customerId]
    );
    return rows[0] || null;
  }

  async createTicket(ticketData) {
    const { customer_id, device_id, issue_description, warranty_status, status } = ticketData;
    const [result] = await this.db.query(
      `INSERT INTO Tickets
         (customer_id, device_id, issue_description, warranty_status, status, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [customer_id, device_id, issue_description, warranty_status, status]
    );
    return {
      ticket_id: result.insertId,
      customer_id,
      device_id,
      issue_description,
      warranty_status,
      status
    };
  }
}

module.exports = TicketRepository;
