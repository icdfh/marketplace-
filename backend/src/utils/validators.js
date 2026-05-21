import { ApiError } from './ApiError.js';

export const ensureRequired = (fields, body) => {
  const missing = fields.filter((field) => body[field] === undefined || body[field] === null || body[field] === '');
  if (missing.length) {
    throw new ApiError(400, `Missing required fields: ${missing.join(', ')}`);
  }
};

export const ensurePositiveNumber = (value, fieldName) => {
  const num = Number(value);
  if (Number.isNaN(num) || num < 0) {
    throw new ApiError(400, `${fieldName} must be a valid positive number`);
  }
  return num;
};

export const ensureInteger = (value, fieldName, min = 0) => {
  const num = Number(value);
  if (!Number.isInteger(num) || num < min) {
    throw new ApiError(400, `${fieldName} must be an integer >= ${min}`);
  }
  return num;
};

export const parsePagination = (query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};
