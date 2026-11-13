function createServiceError(code, statusCode, message) {
  const error = new Error(message);
  error.code = code;
  error.statusCode = statusCode;
  return error;
}

function addMonths(date, months) {
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(date.getDate(), lastDay));
  return target;
}

function dateOnly(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

class TicketService {
  constructor(ticketRepository, clock = () => new Date()) {
    this.ticketRepo = ticketRepository;
    this.clock = clock;
  }

  async listTickets(query = '') {
    return this.ticketRepo.listTickets(query);
  }

  async createTicket(data) {
    if (!data || typeof data !== 'object') {
      throw createServiceError('INVALID_INPUT', 400, 'Ticket data is required.');
    }

    const { customer_id, device_id, issue_description } = data;
    if (!Number.isInteger(customer_id) || customer_id <= 0
        || !Number.isInteger(device_id) || device_id <= 0
        || typeof issue_description !== 'string'
        || issue_description.trim().length === 0
        || issue_description.length > 1000) {
      throw createServiceError('INVALID_INPUT', 400, 'Ticket data is invalid.');
    }

    const device = await this.ticketRepo.findDeviceWithOwner(device_id, customer_id);
    if (!device) {
      throw createServiceError(
        'DEVICE_NOT_FOUND',
        404,
        'The device was not found or does not belong to this customer.'
      );
    }

    const purchaseDate = new Date(device.purchase_date);
    const warrantyMonths = Number(device.warranty_months);
    if (Number.isNaN(purchaseDate.getTime())
        || !Number.isInteger(warrantyMonths)
        || warrantyMonths <= 0) {
      throw createServiceError(
        'INVALID_DEVICE_DATA',
        500,
        'Warranty data for this device is invalid.'
      );
    }

    const expirationDate = addMonths(purchaseDate, warrantyMonths);
    const currentDate = this.clock();
    const warrantyStatus = dateOnly(currentDate) <= dateOnly(expirationDate)
      ? 'In-Warranty'
      : 'Out-of-Warranty';

    return this.ticketRepo.createTicket({
      customer_id,
      device_id,
      issue_description: issue_description.trim(),
      warranty_status: warrantyStatus,
      status: 'Received'
    });
  }
}

module.exports = TicketService;
