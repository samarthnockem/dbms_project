const authCookieName = () => process.env.AUTH_COOKIE_NAME || 'banking_token';
const contextCookieName = () => process.env.CONTEXT_COOKIE_NAME || 'banking_context';

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 24 * 60 * 60 * 1000,
});

const setAuthCookie = (res, token) => {
  res.cookie(authCookieName(), token, cookieOptions());
};

const setContextCookie = (res, context) => {
  res.cookie(contextCookieName(), JSON.stringify(context), cookieOptions());
};

const clearAuthCookies = (res) => {
  res.clearCookie(authCookieName(), cookieOptions());
  res.clearCookie(contextCookieName(), cookieOptions());
};

const readContextCookie = (req) => {
  const value = req.cookies[contextCookieName()];
  if (!value) return null;

  try {
    const context = typeof value === 'string' ? JSON.parse(value) : value;
    const branchId = Number(context.branchId);
    const accountNo = context.accountNo == null ? null : Number(context.accountNo);
    if (!Number.isInteger(branchId) || branchId <= 0) return null;
    if (accountNo !== null && (!Number.isInteger(accountNo) || accountNo <= 0)) return null;
    return { branchId, accountNo };
  } catch (error) {
    return null;
  }
};

export {
  setAuthCookie,
  setContextCookie,
  clearAuthCookies,
  readContextCookie,
};
