import * as accountRepository from '../repositories/account.repository.js';
import * as branchRepository from '../repositories/branch.repository.js';
import { readContextCookie } from '../utils/auth-cookies.js';

const contextMiddleware = async (req, res, next) => {
  const context = readContextCookie(req);
  if (!context) {
    return res.status(409).json({ message: 'Select a branch and account first' });
  }

  try {
    const branch = await branchRepository.findById(context.branchId);
    if (!branch) {
      return res.status(404).json({ message: 'Selected branch does not exist' });
    }

    const accounts = context.accountNo
      ? await accountRepository.listByCustomerAndBranch(req.user.customer_id, context.branchId)
      : [];
    const account = context.accountNo
      ? accounts.find((item) => item.account_no === context.accountNo)
      : null;

    if (context.accountNo && !account) {
      return res.status(403).json({ message: 'Selected account is not available' });
    }

    req.context = { branchId: context.branchId, accountNo: context.accountNo, account };
    return next();
  } catch (error) {
    return next(error);
  }
};

export default contextMiddleware;
