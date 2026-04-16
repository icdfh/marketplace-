import { query } from '../db/pool.js';
import { ApiError } from '../utils/ApiError.js';
import { verifyToken } from '../utils/jwt.js';

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Authorization token is required'));
  }

  try {
    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    const result = await query(
      `SELECT id, email, username, first_name, last_name, avatar, phone, user_type, is_active, created_date
       FROM users
       WHERE id = $1 AND is_active = true`,
      [payload.userId]
    );

    if (!result.rows[0]) {
      return next(new ApiError(401, 'User not found or inactive'));
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    next(new ApiError(401, 'Invalid or expired token'));
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return next(new ApiError(401, 'Unauthorized'));
  if (!roles.includes(req.user.user_type)) {
    return next(new ApiError(403, 'Access denied'));
  }
  next();
};
