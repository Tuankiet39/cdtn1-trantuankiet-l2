class TicketRepository {
  constructor(dbPool) {
    this.db = dbPool;
  }

  async findDeviceWithOwner(deviceId, customerId) {
    const [rows] = await this.db.query(
      `SELECT d.*, c.customer_id FROM Devices d 
       JOIN Customers c ON d.customer_id = c.customer_id 
       WHERE d.device_id = ? AND c.customer_id = ?`,
      [deviceId, customerId]
    );
    return rows[0] || null;
  }

  async createTicket(ticketData) {
    const { customer_id, device_id, issue_description, warranty_status, status } = ticketData;
    const [result] = await this.db.query(
      `INSERT INTO Tickets (customer_id, device_id, issue_description, warranty_status, status, created_at) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [customer_id, device_id, issue_description, warranty_status, status]
    );
    return { ticket_id: result.insertId, ...ticketData };
  }
}

module.exports = TicketRepository;