const TicketService = require('../src/services/ticket.service');

describe('TicketService Unit Tests', () => {
  let ticketService;
  let mockRepo;

  beforeEach(() => {
    mockRepo = {
      findDeviceWithOwner: jest.fn(),
      createTicket: jest.fn()
    };
    ticketService = new TicketService(mockRepo);
  });

  // Test 1: Luồng đúng - Thiết bị còn hạn bảo hành
  test('should create ticket successfully when device is in-warranty', async () => {
    const mockDevice = {
      device_id: 'DEV-001',
      purchase_date: new Date(),
      warranty_months: 12
    };
    mockRepo.findDeviceWithOwner.mockResolvedValue(mockDevice);
    mockRepo.createTicket.mockResolvedValue({ ticket_id: 'TICK-001', status: 'Received' });

    const result = await ticketService.createTicket({
      customer_id: 'CUST-001',
      device_id: 'DEV-001',
      issue_description: 'Lỗi màn hình'
    });

    expect(result).toBeDefined();
    expect(result.ticket_id).toBe('TICK-001');
  });

  // Test 2: Giá trị biên - Thiết bị đã hết hạn bảo hành
  test('should assign Out-of-Warranty status when device warranty has expired', async () => {
    const oldDate = new Date();
    oldDate.setFullYear(oldDate.getFullYear() - 2);
    const mockDevice = {
      device_id: 'DEV-002',
      purchase_date: oldDate,
      warranty_months: 12
    };
    mockRepo.findDeviceWithOwner.mockResolvedValue(mockDevice);
    mockRepo.createTicket.mockResolvedValue({ ticket_id: 'TICK-002', warranty_status: 'Out-of-Warranty' });

    const result = await ticketService.createTicket({
      customer_id: 'CUST-001',
      device_id: 'DEV-002',
      issue_description: 'Lỗi pin'
    });

    expect(result).toBeDefined();
    expect(mockRepo.createTicket).toHaveBeenCalledWith(
      expect.objectContaining({ warranty_status: 'Out-of-Warranty' })
    );
  });

  // Test 3: Luồng ngoại lệ - Thiếu thông tin đầu vào
  test('should throw error when customer_id or device_id is missing', async () => {
    await expect(
      ticketService.createTicket({ customer_id: '', device_id: '' })
    ).rejects.toThrow('INVALID_INPUT');
  });

  // Test 4: Luồng ngoại lệ - Thiết bị không tồn tại
  test('should throw error when device is not found or not owned by customer', async () => {
    mockRepo.findDeviceWithOwner.mockResolvedValue(null);

    await expect(
      ticketService.createTicket({ customer_id: 'CUST-001', device_id: 'INVALID-DEV' })
    ).rejects.toThrow('DEVICE_NOT_FOUND');
  });

  // Test 5: Luồng ngoại lệ - Dữ liệu null
  test('should handle missing data input gracefully and throw error', async () => {
    await expect(
      ticketService.createTicket(null)
    ).rejects.toThrow('INVALID_INPUT');
  });
});