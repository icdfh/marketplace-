import { query } from '../db/pool.js';
import { ensureInteger, ensureRequired } from '../utils/validators.js';

export const getCart = async (req, res) => {
  const result = await query(
    `SELECT c.id, c.item_id, c.quantity, c.created_date,
            i.title, i.price, i.images, i.status,
            (i.price * c.quantity) AS line_total
     FROM cart c
     JOIN items i ON i.id = c.item_id
     WHERE c.user_id = $1
     ORDER BY c.created_date DESC`,
    [req.user.id]
  );

  const total = result.rows.reduce((sum, row) => sum + Number(row.line_total), 0);
  res.json({ items: result.rows, total });
};

export const addToCart = async (req, res) => {
  ensureRequired(['itemId', 'quantity'], req.body);
  const quantity = ensureInteger(req.body.quantity, 'quantity', 1);
  const result = await query(
    `INSERT INTO cart (user_id, item_id, quantity)
     VALUES ($1,$2,$3)
     ON CONFLICT (user_id, item_id)
     DO UPDATE SET quantity = cart.quantity + EXCLUDED.quantity
     RETURNING *`,
    [req.user.id, req.body.itemId, quantity]
  );
  res.status(201).json({ item: result.rows[0] });
};

export const updateCartItem = async (req, res) => {
  const quantity = ensureInteger(req.body.quantity, 'quantity', 1);
  const result = await query(
    `UPDATE cart
     SET quantity = $1
     WHERE user_id = $2 AND item_id = $3
     RETURNING *`,
    [quantity, req.user.id, req.params.itemId]
  );
  res.json({ item: result.rows[0] });
};

export const removeCartItem = async (req, res) => {
  await query('DELETE FROM cart WHERE user_id = $1 AND item_id = $2', [req.user.id, req.params.itemId]);
  res.json({ message: 'Cart item removed successfully' });
};
