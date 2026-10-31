class TicketService {
  constructor(ticketRepository) {
    this.ticketRepo = ticketRepository;
  }

  // QT-03 & QT-05: Tiếp nhận thiết bị, kiểm tra sở hữu và tự động phân loại bảo hành
  async createTicket(data) {
    if (!data) {
      throw new Error('INVALID_INPUT: Dữ liệu đầu vào không hợp lệ.');
    }

    const { customer_id, device_id, issue_description } = data;

    if (!customer_id || !device_id) {
      throw new Error('INVALID_INPUT: Thiếu thông tin khách hàng hoặc thiết bị.');
    }

    // QT-03: Kiểm tra đối chiếu thông tin sở hữu thiết bị của khách hàng
    const device = await this.ticketRepo.findDeviceWithOwner(device_id, customer_id);
    if (!device) {
      throw new Error('DEVICE_NOT_FOUND: Thiết bị không tồn tại hoặc không thuộc sở hữu của khách hàng này.');
    }

    // QT-05: Kiểm tra thời hạn bảo hành dựa trên ngày mua (purchase_date)
    const purchaseDate = device.purchase_date ? new Date(device.purchase_date) : new Date();
    const warrantyMonths = device.warranty_months || 12; 
    const expirationDate = new Date(purchaseDate);
    expirationDate.setMonth(expirationDate.getMonth() + warrantyMonths);

    const currentDate = new Date();
    const warrantyStatus = currentDate <= expirationDate ? 'In-Warranty' : 'Out-of-Warranty';

    const ticketData = {
      customer_id,
      device_id,
      issue_description: issue_description || '',
      warranty_status: warrantyStatus,
      status: 'Received'
    };

    return await this.ticketRepo.createTicket(ticketData);
  }
}

module.exports = TicketService;