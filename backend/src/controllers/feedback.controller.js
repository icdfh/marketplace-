import { query } from '../db/pool.js';
import { ApiError } from '../utils/ApiError.js';
import { ensureInteger, ensureRequired } from '../utils/validators.js';

export const getItemFeedback = async (req, res) => {
  const result = await query(
    `SELECT f.id, f.item_id, f.author_id, f.rating, f.comment, f.created_date,
            u.username, u.avatar
     FROM feedback f
     JOIN users u ON u.id = f.author_id
     WHERE f.item_id = $1
     ORDER BY f.created_date DESC`,
    [req.params.itemId]
  );
  res.json({ items: result.rows });
};

export const createFeedback = async (req, res) => {
  ensureRequired(['itemId', 'rating'], req.body);
  const rating = ensureInteger(req.body.rating, 'rating', 1);
  if (rating > 5) throw new ApiError(400, 'rating must be <= 5');

  const result = await query(
    `INSERT INTO feedback (item_id, author_id, rating, comment)
     VALUES ($1,$2,$3,$4)
     RETURNING *`,
    [req.body.itemId, req.user.id, rating, req.body.comment || null]
  );

  await query(
    `UPDATE items i
     SET average_rating = sub.avg_rating,
         feedback_count = sub.cnt,
         updated_date = NOW()
     FROM (
       SELECT item_id, ROUND(AVG(rating)::numeric, 1) AS avg_rating, COUNT(*)::int AS cnt
       FROM feedback
       WHERE item_id = $1
       GROUP BY item_id
     ) sub
     WHERE i.id = sub.item_id`,
    [req.body.itemId]
  );

  res.status(201).json({ item: result.rows[0] });
};
