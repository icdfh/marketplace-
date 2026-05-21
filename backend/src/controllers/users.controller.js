import { query } from '../db/pool.js';

export const getPublicUser = async (req, res) => {
  const result = await query(
    `SELECT id, username, first_name, last_name, avatar, phone, user_type, created_date
     FROM users
     WHERE id = $1`,
    [req.params.id]
  );
  res.json({ user: result.rows[0] || null });
};

export const updateProfile = async (req, res) => {
  const updated = await query(
    `UPDATE users
     SET first_name = COALESCE($1, first_name),
         last_name = COALESCE($2, last_name),
         avatar = COALESCE($3, avatar),
         phone = COALESCE($4, phone),
         username = COALESCE($5, username)
     WHERE id = $6
     RETURNING id, email, username, first_name, last_name, avatar, phone, user_type, is_active, created_date`,
    [req.body.firstName ?? null, req.body.lastName ?? null, req.body.avatar ?? null, req.body.phone ?? null, req.body.username ?? null, req.user.id]
  );
  res.json({ user: updated.rows[0] });
};
