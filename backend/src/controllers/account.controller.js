import * as accountService from '../services/account.service.js';
import { readContextCookie, setContextCookie } from '../utils/auth-cookies.js';

const list = async (req, res, next) => {
  try {
    const accounts = await accountService.listForContext(req.user.customer_id, req.context.branchId);
    res.json({ branchId: req.context.branchId, accounts });
  } catch (error) {
    next(error);
  }
};

const listAll = async (req, res, next) => {
  try {
    const accounts = await accountService.listAll(req.user.customer_id);
    res.json({ accounts });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const branchId = Number(req.body.branchId);
    const typeCode = typeof req.body.typeCode === 'string' ? req.body.typeCode.trim() : '';
    if (!Number.isInteger(branchId) || branchId <= 0 || !typeCode) {
      return res.status(400).json({ message: 'A valid branch ID and account type are required' });
    }

    const account = await accountService.create(req.user.customer_id, branchId, typeCode);
    setContextCookie(res, { branchId, accountNo: account.accountNo });
    return res.status(201).json({ account });
  } catch (error) {
    return next(error);
  }
};

const select = async (req, res, next) => {
  try {
    const accountNo = Number(req.body.accountNo);
    const context = readContextCookie(req);
    if (!context) {
      return res.status(409).json({ message: 'Select a branch first' });
    }
    if (!Number.isInteger(accountNo) || accountNo <= 0) {
      return res.status(400).json({ message: 'A valid account number is required' });
    }

    const account = await accountService.select(
      req.user.customer_id,
      context.branchId,
      accountNo,
    );
    setContextCookie(res, { branchId: context.branchId, accountNo });
    return res.json({ account });
  } catch (error) {
    return next(error);
  }
};

export { list, listAll, create, select };
