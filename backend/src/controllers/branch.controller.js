import * as branchRepository from '../repositories/branch.repository.js';

const list = async (req, res, next) => {
  try {
    const branches = await branchRepository.list();
    res.json({ branches });
  } catch (error) {
    next(error);
  }
};

export { list };
