import * as loanService from '../services/loan.service.js';

const create = async (req, res, next) => {
  try {
    const loan = await loanService.create(
      req.user.customer_id,
      req.context.branchId,
      req.body.principal,
      req.body.termMonths,
    );
    res.status(201).json({ loan });
  } catch (error) {
    next(error);
  }
};

const list = async (req, res, next) => {
  try {
    const loans = await loanService.list(req.user.customer_id, req.context.branchId);
    res.json({ branchId: req.context.branchId, loans });
  } catch (error) {
    next(error);
  }
};

export { create, list };
