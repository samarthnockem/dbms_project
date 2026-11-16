import jwt from 'jsonwebtoken';
import * as users from '../repositories/user.repository.js';

const authMiddleware = async (req, res, next) => {
  const token = req.cookies[process.env.AUTH_COOKIE_NAME || 'banking_token'];
  if (!token) return res.status(401).json({ message: 'Authentication required' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await users.findById(payload.userID);
    if (!user) return res.status(401).json({ message: 'User no longer exists' });
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired authentication token' });
  }
};

export default authMiddleware;
