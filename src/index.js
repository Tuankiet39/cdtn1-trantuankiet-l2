const express = require('express');
const path = require('path');
const createTicketRoutes = require('./routes/ticket.routes');

function createApp(ticketService) {
  const app = express();
  app.use(express.json({ limit: '16kb' }));

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.use(express.static(path.join(__dirname, 'client')));
  app.use('/api', createTicketRoutes(ticketService));

  app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
      return res.status(400).json({
        status: 'error',
        code: 'INVALID_JSON',
        message: 'Request body must be valid JSON.'
      });
    }

    console.error('Unhandled request error:', { code: error.code || 'UNKNOWN' });
    return res.status(500).json({
      status: 'error',
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred.'
    });
  });

  return app;
}

module.exports = createApp;
