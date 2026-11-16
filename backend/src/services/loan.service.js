import * as loans from '../repositories/loan.repository.js';

const create = async (customerId, branchId, principal, termMonths) => {
  const numericPrincipal = Number(principal);
  const numericTerm = Number(termMonths);
  const interestRate = Number(process.env.DEFAULT_LOAN_INTEREST_RATE);
  if (!Number.isFinite(numericPrincipal) || numericPrincipal <= 0 || !Number.isFinite(numericTerm) || !Number.isInteger(numericTerm) || numericTerm <= 0) {
    const error = new Error('Principal and term must be positive valid values');
    error.statusCode = 400;
    throw error;
  }
  if (!Number.isFinite(interestRate) || interestRate < 0) {
    const error = new Error('Loan interest rate is not configured correctly');
    error.statusCode = 500;
    throw error;
  }
  return loans.create(customerId, branchId, numericPrincipal.toFixed(2), numericTerm, interestRate.toFixed(2));
};

const list = (customerId, branchId) => loans.listByCustomerAndBranch(customerId, branchId);

export { create, list };
