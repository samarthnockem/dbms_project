const selectedAccountMiddleware = (req, res, next) => {
  if (!req.context?.accountNo) {
    return res.status(409).json({ message: 'Select an account first' });
  }
  return next();
};

export default selectedAccountMiddleware;
