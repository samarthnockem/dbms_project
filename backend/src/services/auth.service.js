import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as users from '../repositories/user.repository.js';
import * as branches from '../repositories/branch.repository.js';

const signToken = (userId) => jwt.sign({ userID: userId }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN || '1d',
});

const register = async ({ name, phone, email, address, dateOfBirth, password }) => {
  const existing = await users.findByEmail(email);
  if (existing) {
    const error = new Error('An account with this email already exists');
    error.statusCode = 409;
    throw error;
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await users.create({ name, phone, email, address, dateOfBirth, passwordHash });
  return { user: sanitizeUser(user), token: signToken(user.customer_id) };
};

const login = async ({ branchId, email, password }) => {
  const user = await users.findByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const branch = await branches.findById(branchId);
  if (!branch) {
    const error = new Error('Selected branch does not exist');
    error.statusCode = 404;
    throw error;
  }

  return {
    user: sanitizeUser(user),
    token: signToken(user.customer_id),
    branch,
  };
};

const sanitizeUser = (user) => ({
  customerID: user.customer_id,
  name: user.name,
  phone: user.phone,
  email: user.email,
  address: user.address,
  dateOfBirth: user.date_of_birth,
  joiningDate: user.joining_date,
});

const sanitizeAccount = (account) => ({
  accountNo: account.account_no,
  customerID: account.customer_id,
  typeCode: account.type_code,
  branchID: account.branch_id,
  branchName: account.branch_name,
  city: account.city,
  balance: account.balance,
  status: account.status,
  dateOpened: account.date_opened,
  accountTypeDescription: account.account_type_description,
});

export { register, login, sanitizeUser, sanitizeAccount };
