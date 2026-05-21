import { ApiError } from '../utils/ApiError.js';

export const errorHandler = (err, req, res, next) => {
  const status = err instanceof ApiError ? err.statusCode : 500;
  const response = {
    message: err.message || 'Internal server error'
  };

  if (err.details) response.details = err.details;
  if (process.env.NODE_ENV !== 'production' && !(err instanceof ApiError)) {
    response.stack = err.stack;
  }

  res.status(status).json(response);
};
