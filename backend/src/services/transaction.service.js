import * as transactions from '../repositories/transaction.repository.js';

const assertAmount = (amount) => {
  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount) || numericAmount <= 0 || Math.round(numericAmount * 100) !== numericAmount * 100) {
    const error = new Error('Amount must be a positive number with at most two decimal places');
    error.statusCode = 400;
    throw error;
  }
  return numericAmount.toFixed(2);
};

const deposit = (customerId, accountNo, amount) => transactions.deposit(customerId, accountNo, assertAmount(amount));
const withdraw = (customerId, accountNo, amount) => transactions.withdraw(customerId, accountNo, assertAmount(amount));

const transfer = (customerId, fromAccountNo, toAccountNo, amount) => {
  if (!Number.isInteger(Number(toAccountNo)) || Number(toAccountNo) <= 0 || Number(toAccountNo) === Number(fromAccountNo)) {
    const error = new Error('A different valid destination account is required');
    error.statusCode = 400;
    throw error;
  }
  return transactions.transfer(customerId, fromAccountNo, Number(toAccountNo), assertAmount(amount));
};

const history = (accountNo) => transactions.history(accountNo);

export { deposit, withdraw, transfer, history };
