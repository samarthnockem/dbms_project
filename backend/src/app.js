import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';
import branchRoutes from './routes/branch.routes.js';
import accountRoutes from './routes/account.routes.js';
import accountTypeRoutes from './routes/account-type.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import loanRoutes from './routes/loan.routes.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/branches', branchRoutes);
app.use('/api/account-types', accountTypeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/loans', loanRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({ message: err.statusCode ? err.message : 'Internal server error' });
});

export default app;
