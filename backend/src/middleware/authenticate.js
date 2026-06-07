import jwt from 'jsonwebtoken';

/**
 * Authenticate middleware — verifies the Bearer JWT token.
 * Attaches `req.user` on success.
 */
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized — no token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Unauthorized — invalid or expired token' });
  }
};

/**
 * Optional role-based guard — use after authenticate.
 * Usage: requireRole('ADMIN') or requireRole('ADMIN', 'EDITOR')
 */
export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Forbidden — insufficient permissions' });
  }
  next();
};
