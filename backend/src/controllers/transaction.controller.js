import * as transactionService from '../services/transaction.service.js';

const deposit = async (req, res, next) => {
  try {
    const transaction = await transactionService.deposit(req.user.customer_id, req.context.accountNo, req.body.amount);
    res.status(201).json({ transaction });
  } catch (error) {
    next(error);
  }
};

const withdraw = async (req, res, next) => {
  try {
    const transaction = await transactionService.withdraw(req.user.customer_id, req.context.accountNo, req.body.amount);
    res.status(201).json({ transaction });
  } catch (error) {
    next(error);
  }
};

const transfer = async (req, res, next) => {
  try {
    const transaction = await transactionService.transfer(
      req.user.customer_id,
      req.context.accountNo,
      req.body.toAccountNo,
      req.body.amount,
    );
    res.status(201).json({ transaction });
  } catch (error) {
    next(error);
  }
};

const history = async (req, res, next) => {
  try {
    const transactions = await transactionService.history(req.context.accountNo);
    res.json({ accountNo: req.context.accountNo, transactions });
  } catch (error) {
    next(error);
  }
};

export { deposit, withdraw, transfer, history };
