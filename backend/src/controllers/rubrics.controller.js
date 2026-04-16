import { query } from '../db/pool.js';
import { ensureRequired } from '../utils/validators.js';

export const getRubrics = async (req, res) => {
  const result = await query(
    `SELECT id, parent_id, name, slug, description, created_date
     FROM rubrics
     ORDER BY created_date ASC`
  );
  res.json({ items: result.rows });
};

export const createRubric = async (req, res) => {
  ensureRequired(['name', 'slug'], req.body);
  const { name, slug, description = null, parentId = null } = req.body;
  const result = await query(
    `INSERT INTO rubrics (parent_id, name, slug, description)
     VALUES ($1,$2,$3,$4)
     RETURNING *`,
    [parentId, name, slug, description]
  );
  res.status(201).json({ item: result.rows[0] });
};
