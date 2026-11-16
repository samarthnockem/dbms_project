import * as accounts from '../repositories/account.repository.js';
import * as authService from './auth.service.js';

const listForContext = async (customerId, branchId) => {
  const result = await accounts.listByCustomerAndBranch(customerId, branchId);
  return result.map(authService.sanitizeAccount);
};

const listAll = async (customerId) => {
  const result = await accounts.listByCustomer(customerId);
  return result.map(authService.sanitizeAccount);
};

const create = async (customerId, branchId, typeCode) => {
  const accountNo = await accounts.create(customerId, branchId, typeCode);
  const account = await accounts.findOwnedSelectable(customerId, branchId, accountNo);
  return authService.sanitizeAccount(account);
};

const select = async (customerId, branchId, accountNo) => {
  const account = await accounts.findOwnedSelectable(customerId, branchId, accountNo);
  if (!account) {
    const error = new Error('Selected account is not available');
    error.statusCode = 403;
    throw error;
  }
  return authService.sanitizeAccount(account);
};

export { listForContext, listAll, create, select };
