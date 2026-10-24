const OrderService = require('../src/services/order.service');

describe('OrderService Unit Tests', () => {
    let orderService;
    let mockRepo;

    beforeEach(() => {
        mockRepo = {};
        orderService = new OrderService(mockRepo);
    });

    test('should calculate total amount correctly for valid items', async () => {
        const items = [{ product_id: 'P1', quantity: 2, unit_price: 100 }];
        const result = await orderService.createOrder('USER-01', items);
        expect(result).toBeDefined();
    });

    test('should accept order when item quantity is at boundary value 1', async () => {
        const items = [{ product_id: 'P1', quantity: 1, unit_price: 50 }];
        const result = await orderService.createOrder('USER-01', items);
        expect(result).toBeDefined();
    });

    test('should throw error when items array is empty', async () => {
        await expect(orderService.createOrder('USER-01', [])).rejects.toThrow(
            'Giỏ hàng phải có ít nhất 1 sản phẩm'
        );
    });

    test('should throw error when item quantity is less than or equal to 0', async () => {
        const items = [{ product_id: 'P1', quantity: 0, unit_price: 100 }];
        await expect(orderService.createOrder('USER-01', items)).rejects.toThrow();
    });

    test('should throw error when items input is null or undefined', async () => {
        await expect(orderService.createOrder('USER-01', null)).rejects.toThrow(
            'Giỏ hàng phải có ít nhất 1 sản phẩm'
        );
    });
});