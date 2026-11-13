const request = require('supertest');
const createApp = require('../src');
const TicketService = require('../src/services/ticket.service');

describe('Warranty ticket API', () => {
  let app;
  let tickets;

  beforeEach(() => {
    tickets = [
      {
        id: 1,
        customer_name: 'Tran Tuan Kiet',
        serial_number: 'SN123456',
        status: 'In-Warranty'
      },
      {
        id: 2,
        customer_name: 'Nguyen Van A',
        serial_number: 'SN987654',
        status: 'Out-of-Warranty'
      }
    ];

    const repository = {
      listTickets: jest.fn(async (query) => tickets.filter((ticket) => (
        !query
        || String(ticket.id).includes(query)
        || ticket.customer_name.toLowerCase().includes(query.toLowerCase())
        || ticket.serial_number.toLowerCase().includes(query.toLowerCase())
      ))),
      findDeviceWithOwner: jest.fn(async (deviceId, customerId) => (
        deviceId === 10 && customerId === 1
          ? { purchase_date: '2026-01-01', warranty_months: 12 }
          : null
      )),
      createTicket: jest.fn(async (data) => {
        const ticket = { ticket_id: 3, ...data };
        tickets.push({
          id: ticket.ticket_id,
          customer_name: 'Tran Tuan Kiet',
          serial_number: 'SN123456',
          status: ticket.warranty_status
        });
        return ticket;
      })
    };

    app = createApp(new TicketService(repository));
  });

  test('T08 serves health and returns the current ticket list', async () => {
    const health = await request(app).get('/health');
    const response = await request(app).get('/api/tickets');

    expect(health.status).toBe(200);
    expect(health.body).toEqual({ status: 'ok' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]).toEqual(expect.objectContaining({
      id: 1,
      serial_number: 'SN123456'
    }));
  });

  test('T09 produces the same search result on repeated requests', async () => {
    const first = await request(app).get('/api/tickets?q=SN123456');
    const second = await request(app).get('/api/tickets?q=SN123456');

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(second.body).toEqual(first.body);
    expect(first.body).toHaveLength(1);
  });

  test('T10 creates a ticket and classifies its warranty', async () => {
    const response = await request(app)
      .post('/api/tickets')
      .send({
        customer_id: 1,
        device_id: 10,
        issue_description: 'Screen issue'
      });

    expect(response.status).toBe(201);
    expect(response.body.data).toEqual(expect.objectContaining({
      ticket_id: 3,
      warranty_status: 'In-Warranty',
      status: 'Received'
    }));
  });

  test('T11 rejects malformed input without creating a ticket', async () => {
    const response = await request(app)
      .post('/api/tickets')
      .send({ customer_id: '1', device_id: 10, issue_description: '' });

    expect(response.status).toBe(400);
    expect(response.body.code).toBe('INVALID_FORMAT');
    expect(response.body.details).toHaveProperty('customer_id');
    expect(response.body.details).toHaveProperty('issue_description');
  });

  test('T12 denies a device lookup for a different customer without exposing data', async () => {
    const response = await request(app)
      .post('/api/tickets')
      .send({
        customer_id: 2,
        device_id: 10,
        issue_description: 'Screen issue'
      });

    expect(response.status).toBe(404);
    expect(response.body.code).toBe('DEVICE_NOT_FOUND');
    expect(response.body.message).not.toContain('SN123456');
  });
});
