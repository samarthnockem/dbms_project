import * as accountTypeRepository from '../repositories/account-type.repository.js';

const list = async (req, res, next) => {
  try {
    const accountTypes = await accountTypeRepository.list();
    res.json({ accountTypes });
  } catch (error) {
    next(error);
  }
};

export { list };
