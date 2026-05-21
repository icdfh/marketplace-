import { query } from '../db/pool.js';
import { ensureRequired } from '../utils/validators.js';

export const getFavorites = async (req, res) => {
  const result = await query(
    `SELECT f.id, f.user_id, f.item_id, f.created_date,
            i.title, i.price, i.images, i.status
     FROM favorites f
     JOIN items i ON i.id = f.item_id
     WHERE f.user_id = $1
     ORDER BY f.created_date DESC`,
    [req.user.id]
  );
  res.json({ items: result.rows });
};

export const addFavorite = async (req, res) => {
  ensureRequired(['itemId'], req.body);
  const { itemId } = req.body;
  const result = await query(
    `INSERT INTO favorites (user_id, item_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, item_id) DO NOTHING
     RETURNING *`,
    [req.user.id, itemId]
  );
  res.status(201).json({ item: result.rows[0] || { user_id: req.user.id, item_id: itemId } });
};

export const removeFavorite = async (req, res) => {
  await query('DELETE FROM favorites WHERE user_id = $1 AND item_id = $2', [req.user.id, req.params.itemId]);
  res.json({ message: 'Favorite removed successfully' });
};
