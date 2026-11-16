import 'dotenv/config';

import app from './src/app.js';
import { pool } from './src/db/pool.js';

const port = Number(process.env.PORT || 5000);
const server = app.listen(port, () => {
  console.log(`Banking API listening on port ${port}`);
});

const shutdown = async (signal) => {
  console.log(`${signal} received; shutting down gracefully`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
