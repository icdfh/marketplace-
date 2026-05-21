import bcrypt from 'bcryptjs';
import { query } from '../db/pool.js';
import { ApiError } from '../utils/ApiError.js';
import { signToken } from '../utils/jwt.js';
import { ensureRequired } from '../utils/validators.js';

export const register = async (req, res) => {
  ensureRequired(['email', 'password', 'username'], req.body);
  const {
    email,
    password,
    username,
    firstName = null,
    lastName = null,
    avatar = null,
    phone = null,
    userType = 'buyer'
  } = req.body;

  const existing = await query(
    'SELECT id FROM users WHERE email = $1 OR username = $2',
    [email.toLowerCase(), username]
  );

  if (existing.rows[0]) throw new ApiError(409, 'Email or username already exists');

  const passwordHash = await bcrypt.hash(password, 10);
  const result = await query(
    `INSERT INTO users (email, password_hash, username, first_name, last_name, avatar, phone, user_type)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     RETURNING id, email, username, first_name, last_name, avatar, phone, user_type, created_date`,
    [email.toLowerCase(), passwordHash, username, firstName, lastName, avatar, phone, userType]
  );

  const user = result.rows[0];
  const token = signToken({ userId: user.id, role: user.user_type });
  res.status(201).json({ user, token });
};

export const login = async (req, res) => {
  ensureRequired(['email', 'password'], req.body);
  const { email, password } = req.body;

  const result = await query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
  const user = result.rows[0];
  if (!user) throw new ApiError(401, 'Invalid email or password');
  if (!user.is_active) throw new ApiError(403, 'User is inactive');

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) throw new ApiError(401, 'Invalid email or password');

  const token = signToken({ userId: user.id, role: user.user_type });
  res.json({
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      avatar: user.avatar,
      phone: user.phone,
      user_type: user.user_type,
      created_date: user.created_date
    },
    token
  });
};

export const me = async (req, res) => {
  res.json({ user: req.user });
};
