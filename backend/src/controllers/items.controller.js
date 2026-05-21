import { query } from '../db/pool.js';
import { ApiError } from '../utils/ApiError.js';
import { ensurePositiveNumber, ensureRequired, parsePagination } from '../utils/validators.js';

const itemSelect = `
  SELECT i.id, i.seller_id, i.rubric_id, i.title, i.description, i.price, i.images, i.status,
         i.average_rating, i.feedback_count, i.created_date, i.updated_date,
         u.username AS seller_username,
         r.name AS rubric_name
  FROM items i
  JOIN users u ON u.id = i.seller_id
  JOIN rubrics r ON r.id = i.rubric_id
`;

export const getItems = async (req, res) => {
  const { page, limit, offset } = parsePagination(req.query);
  const filters = [];
  const values = [];

  if (req.query.status) {
    values.push(req.query.status);
    filters.push(`i.status = $${values.length}`);
  }
  if (req.query.rubricId) {
    values.push(req.query.rubricId);
    filters.push(`i.rubric_id = $${values.length}`);
  }
  if (req.query.sellerId) {
    values.push(req.query.sellerId);
    filters.push(`i.seller_id = $${values.length}`);
  }
  if (req.query.search) {
    values.push(`%${req.query.search}%`);
    filters.push(`(i.title ILIKE $${values.length} OR i.description ILIKE $${values.length})`);
  }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const listValues = [...values, limit, offset];
  const result = await query(
    `${itemSelect}
     ${whereClause}
     ORDER BY i.created_date DESC
     LIMIT $${listValues.length - 1} OFFSET $${listValues.length}`,
    listValues
  );

  res.json({ page, limit, items: result.rows });
};

export const getItemById = async (req, res) => {
  const result = await query(`${itemSelect} WHERE i.id = $1`, [req.params.id]);
  if (!result.rows[0]) throw new ApiError(404, 'Item not found');
  res.json({ item: result.rows[0] });
};

export const createItem = async (req, res) => {
  ensureRequired(['rubricId', 'title', 'price'], req.body);
  const { rubricId, title, description = null, price, images = [], status = 'active' } = req.body;
  const parsedPrice = ensurePositiveNumber(price, 'price');

  const result = await query(
    `INSERT INTO items (seller_id, rubric_id, title, description, price, images, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     RETURNING *`,
    [req.user.id, rubricId, title, description, parsedPrice, JSON.stringify(images), status]
  );

  res.status(201).json({ item: result.rows[0] });
};

export const updateItem = async (req, res) => {
  const existing = await query('SELECT * FROM items WHERE id = $1', [req.params.id]);
  const item = existing.rows[0];
  if (!item) throw new ApiError(404, 'Item not found');
  if (item.seller_id !== req.user.id && req.user.user_type !== 'admin') {
    throw new ApiError(403, 'You can edit only your own items');
  }

  const updated = {
    rubric_id: req.body.rubricId ?? item.rubric_id,
    title: req.body.title ?? item.title,
    description: req.body.description ?? item.description,
    price: req.body.price !== undefined ? ensurePositiveNumber(req.body.price, 'price') : item.price,
    images: req.body.images !== undefined ? JSON.stringify(req.body.images) : item.images,
    status: req.body.status ?? item.status
  };

  const result = await query(
    `UPDATE items
     SET rubric_id = $1, title = $2, description = $3, price = $4, images = $5, status = $6, updated_date = NOW()
     WHERE id = $7
     RETURNING *`,
    [updated.rubric_id, updated.title, updated.description, updated.price, updated.images, updated.status, req.params.id]
  );

  res.json({ item: result.rows[0] });
};

export const deleteItem = async (req, res) => {
  const existing = await query('SELECT seller_id FROM items WHERE id = $1', [req.params.id]);
  const item = existing.rows[0];
  if (!item) throw new ApiError(404, 'Item not found');
  if (item.seller_id !== req.user.id && req.user.user_type !== 'admin') {
    throw new ApiError(403, 'You can delete only your own items');
  }

  await query('DELETE FROM items WHERE id = $1', [req.params.id]);
  res.json({ message: 'Item deleted successfully' });
};
