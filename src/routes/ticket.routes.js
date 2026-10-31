const express = require('express');
const { validateCreateOrderInput } = require('../validators/order.validator');

module.exports = function (orderService) {
  const router = express.Router();

  router.post('/orders', async (req, res) => {
    // Tầng 1: Kiểm tra định dạng đầu vào
    const validationErrors = validateCreateOrderInput(req.body);
    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({
        status: 'error',
        code: 'INVALID_FORMAT',
        message: 'Lỗi định dạng dữ liệu đầu vào',
        details: validationErrors
      });
    }

    try {
      const { user_id, items } = req.body;
      const order = await orderService.createOrder(user_id, items);
      return res.status(201).json({ status: 'success', code: 201, data: order });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        status: 'error',
        code: error.code || 'INTERNAL_SERVER_ERROR',
        message: error.message
      });
    }
  });

  router.post('/orders/:order_id/cancel', async (req, res) => {
    try {
      const { order_id } = req.params;
      const { user_id } = req.body;
      const result = await orderService.cancelOrder(Number(order_id), user_id);
      return res.status(200).json({ status: 'success', code: 200, data: result });
    } catch (error) {
      const statusCode = error.statusCode || 500;
      return res.status(statusCode).json({
        status: 'error',
        code: error.code || 'INTERNAL_SERVER_ERROR',
        message: error.message
      });
    }
  });

  return router;
};