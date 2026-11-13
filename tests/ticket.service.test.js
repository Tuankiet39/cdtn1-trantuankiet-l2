const TicketService = require('../src/services/ticket.service');

describe('TicketService', () => {
  let ticketService;
  let repository;
  const today = new Date(2026, 10, 13);

  beforeEach(() => {
    repository = {
      listTickets: jest.fn().mockResolvedValue([]),
      findDeviceWithOwner: jest.fn(),
      createTicket: jest.fn().mockImplementation(async (ticket) => ({
        ticket_id: 1,
        ...ticket
      }))
    };
    ticketService = new TicketService(repository, () => new Date(today));
  });

  function createTicket(device = { purchase_date: '2026-01-01', warranty_months: 12 }) {
    repository.findDeviceWithOwner.mockResolvedValue(device);
    return ticketService.createTicket({
      customer_id: 1,
      device_id: 1,
      issue_description: 'Screen does not turn on'
    });
  }

  test('T01 classifies a device within its warranty period', async () => {
    await createTicket();

    expect(repository.createTicket).toHaveBeenCalledWith(
      expect.objectContaining({ warranty_status: 'In-Warranty', status: 'Received' })
    );
  });

  test('T02 classifies a device past its warranty period', async () => {
    await createTicket({ purchase_date: '2024-01-01', warranty_months: 12 });

    expect(repository.createTicket).toHaveBeenCalledWith(
      expect.objectContaining({ warranty_status: 'Out-of-Warranty' })
    );
  });

  test('T03 includes the final calendar day of warranty', async () => {
    ticketService = new TicketService(repository, () => new Date(2025, 1, 28));
    await createTicket({ purchase_date: '2025-01-31', warranty_months: 1 });

    expect(repository.createTicket).toHaveBeenCalledWith(
      expect.objectContaining({ warranty_status: 'In-Warranty' })
    );
  });

  test('T04 expires warranty on the day after the final calendar day', async () => {
    ticketService = new TicketService(repository, () => new Date(2025, 2, 1));
    await createTicket({ purchase_date: '2025-01-31', warranty_months: 1 });

    expect(repository.createTicket).toHaveBeenCalledWith(
      expect.objectContaining({ warranty_status: 'Out-of-Warranty' })
    );
  });

  test('T05 rejects missing or invalid ticket fields', async () => {
    await expect(ticketService.createTicket(null)).rejects.toMatchObject({
      code: 'INVALID_INPUT',
      statusCode: 400
    });
    expect(repository.findDeviceWithOwner).not.toHaveBeenCalled();
  });

  test('T06 rejects a device not owned by the supplied customer', async () => {
    repository.findDeviceWithOwner.mockResolvedValue(null);

    await expect(ticketService.createTicket({
      customer_id: 2,
      device_id: 1,
      issue_description: 'Screen issue'
    })).rejects.toMatchObject({ code: 'DEVICE_NOT_FOUND', statusCode: 404 });
    expect(repository.createTicket).not.toHaveBeenCalled();
  });

  test('T07 fails safely when stored warranty dates are invalid', async () => {
    await expect(createTicket({ purchase_date: 'not-a-date', warranty_months: 12 }))
      .rejects.toMatchObject({ code: 'INVALID_DEVICE_DATA', statusCode: 500 });
    expect(repository.createTicket).not.toHaveBeenCalled();
  });
});
