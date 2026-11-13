const express = require('express');
const { validateCreateTicketInput } = require('../validators/ticket.validator');

module.exports = function createTicketRoutes(ticketService) {
  const router = express.Router();

  router.get('/tickets', async (req, res) => {
    if (typeof req.query.q !== 'undefined' && typeof req.query.q !== 'string') {
      return res.status(400).json({
        status: 'error',
        code: 'INVALID_QUERY',
        message: 'q must be a string.'
      });
    }

    const query = (req.query.q || '').trim();
    if (query.length > 100) {
      return res.status(400).json({
        status: 'error',
        code: 'INVALID_QUERY',
        message: 'q must be 100 characters or fewer.'
      });
    }

    try {
      const tickets = await ticketService.listTickets(query);
      return res.status(200).json(tickets);
    } catch (error) {
      console.error('Unable to list warranty tickets:', { code: error.code || 'UNKNOWN' });
      return res.status(500).json({
        status: 'error',
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Unable to retrieve warranty tickets.'
      });
    }
  });

  router.post('/tickets', async (req, res) => {
    const validationErrors = validateCreateTicketInput(req.body);
    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({
        status: 'error',
        code: 'INVALID_FORMAT',
        message: 'Invalid ticket data.',
        details: validationErrors
      });
    }

    try {
      const ticket = await ticketService.createTicket(req.body);
      return res.status(201).json({ status: 'success', data: ticket });
    } catch (error) {
      if (error.code === 'DEVICE_NOT_FOUND') {
        return res.status(404).json({
          status: 'error',
          code: error.code,
          message: error.message
        });
      }

      console.error('Unable to create warranty ticket:', { code: error.code || 'UNKNOWN' });
      return res.status(500).json({
        status: 'error',
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Unable to create warranty ticket.'
      });
    }
  });

  return router;
};
