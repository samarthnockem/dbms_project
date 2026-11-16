import * as authService from '../services/auth.service.js';
import { setAuthCookie, setContextCookie, clearAuthCookies } from '../utils/auth-cookies.js';

const validateCredentials = ({ name, email, password, dateOfBirth, branchId }, requireRegistration = false) => {
  if ((requireRegistration && (!name || !dateOfBirth)) || !email || !password) {
    const error = new Error('Name, email, password, and date of birth are required');
    error.statusCode = 400;
    throw error;
  }
  if (typeof email !== 'string' || typeof password !== 'string' || password.length < 8) {
    const error = new Error('Email must be valid and password must be at least 8 characters');
    error.statusCode = 400;
    throw error;
  }
  if (!requireRegistration && (!Number.isInteger(Number(branchId)) || Number(branchId) <= 0)) {
    const error = new Error('A valid branch ID is required');
    error.statusCode = 400;
    throw error;
  }
};

const register = async (req, res, next) => {
  try {
    validateCredentials(req.body, true);
    const result = await authService.register(req.body);
    setAuthCookie(res, result.token);
    res.status(201).json({ user: result.user });
  } catch (error) { next(error); }
};

const login = async (req, res, next) => {
  try {
    validateCredentials(req.body);
    const result = await authService.login(req.body);
    setAuthCookie(res, result.token);
    setContextCookie(res, { branchId: Number(req.body.branchId), accountNo: null });
    res.json({ user: result.user, branch: result.branch });
  } catch (error) { next(error); }
};

const logout = (req, res) => {
  clearAuthCookies(res);
  res.status(204).send();
};

const me = (req, res) => res.json({
  user: authService.sanitizeUser(req.user),
  context: {
    branchId: req.context?.branchId ?? null,
    accountNo: req.context?.accountNo ?? null,
  },
});

export { register, login, logout, me };
