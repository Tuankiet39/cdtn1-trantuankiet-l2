require('dotenv').config();
const mysql = require('mysql2/promise');
const createApp = require('./src');
const TicketRepository = require('./src/repositories/ticket.repository');
const TicketService = require('./src/services/ticket.service');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  database: process.env.DB_NAME || 'mekong_crm',
  user: process.env.DB_USER || 'warranty_app',
  password: process.env.DB_PASSWORD || 'warranty_dev',
  waitForConnections: true,
  connectionLimit: 10,
  timezone: 'Z',
  dateStrings: ['DATE']
});

const ticketService = new TicketService(new TicketRepository(pool));
const app = createApp(ticketService);
const port = Number(process.env.PORT || 3000);

if (require.main === module) {
  const server = app.listen(port, () => {
    console.log(`Warranty ticket API listening on http://localhost:${port}`);
  });

  server.on('error', (error) => {
    console.error('Unable to start the API server:', { code: error.code || 'UNKNOWN' });
    process.exitCode = 1;
  });
}

module.exports = app;
