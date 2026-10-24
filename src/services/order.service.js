const OrderRepository = require('../repositories/order.repository');

class AppError extends Error {
    constructor(code, message, statusCode = 400) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
    }
}

class OrderService {
    constructor(orderRepository) {
        this.orderRepo = orderRepository;
    }

    async createOrder(userId, items) {
        if (!items || !Array.isArray(items) || items.length === 0) {
            throw new AppError('INVALID_INPUT', 'Giỏ hàng phải có ít nhất 1 sản phẩm', 400);
        }

        let totalAmount = 0;
        for (const item of items) {
            if (!item.quantity || item.quantity <= 0) {
                throw new AppError('INVALID_QUANTITY', `Số lượng mua của sản phẩm phải lớn hơn 0`, 400);
            }
            totalAmount += item.quantity * item.unit_price;
        }

        return {
            userId,
            items,
            totalAmount,
            status: 'PENDING'
        };
    }
}

module.exports = OrderService;