import { query } from '../db/pool.js';
import { ApiError } from '../utils/ApiError.js';
import { ensureRequired } from '../utils/validators.js';

export const getMyChats = async (req, res) => {
  const result = await query(
    `SELECT c.id, c.buyer_id, c.participant_id, c.chat_type, c.is_active, c.created_date,
            buyer.username AS buyer_username,
            participant.username AS participant_username,
            last_message.content AS last_message,
            last_message.created_date AS last_message_date
     FROM chats c
     JOIN users buyer ON buyer.id = c.buyer_id
     JOIN users participant ON participant.id = c.participant_id
     LEFT JOIN LATERAL (
       SELECT m.content, m.created_date
       FROM messages m
       WHERE m.chat_id = c.id
       ORDER BY m.created_date DESC
       LIMIT 1
     ) last_message ON true
     WHERE c.buyer_id = $1 OR c.participant_id = $1
     ORDER BY COALESCE(last_message.created_date, c.created_date) DESC`,
    [req.user.id]
  );
  res.json({ items: result.rows });
};

export const createChat = async (req, res) => {
  ensureRequired(['participantId'], req.body);
  const { participantId, chatType = 'direct' } = req.body;

  const existing = await query(
    `SELECT * FROM chats
     WHERE buyer_id = $1 AND participant_id = $2 AND chat_type = $3
     LIMIT 1`,
    [req.user.id, participantId, chatType]
  );

  if (existing.rows[0]) {
    return res.status(200).json({ item: existing.rows[0], reused: true });
  }

  const result = await query(
    `INSERT INTO chats (buyer_id, participant_id, chat_type)
     VALUES ($1,$2,$3)
     RETURNING *`,
    [req.user.id, participantId, chatType]
  );
  res.status(201).json({ item: result.rows[0] });
};

export const getChatMessages = async (req, res) => {
  const access = await query('SELECT * FROM chats WHERE id = $1 AND (buyer_id = $2 OR participant_id = $2)', [req.params.chatId, req.user.id]);
  if (!access.rows[0]) throw new ApiError(404, 'Chat not found');

  const result = await query(
    `SELECT m.id, m.chat_id, m.sender_id, m.content, m.is_read, m.created_date,
            u.username, u.avatar
     FROM messages m
     JOIN users u ON u.id = m.sender_id
     WHERE m.chat_id = $1
     ORDER BY m.created_date ASC`,
    [req.params.chatId]
  );

  res.json({ items: result.rows });
};

export const sendMessage = async (req, res) => {
  ensureRequired(['content'], req.body);
  const access = await query('SELECT * FROM chats WHERE id = $1 AND (buyer_id = $2 OR participant_id = $2)', [req.params.chatId, req.user.id]);
  if (!access.rows[0]) throw new ApiError(404, 'Chat not found');

  const result = await query(
    `INSERT INTO messages (chat_id, sender_id, content)
     VALUES ($1,$2,$3)
     RETURNING *`,
    [req.params.chatId, req.user.id, req.body.content]
  );

  res.status(201).json({ item: result.rows[0] });
};

export const markMessagesRead = async (req, res) => {
  await query(
    `UPDATE messages
     SET is_read = true
     WHERE chat_id = $1 AND sender_id <> $2`,
    [req.params.chatId, req.user.id]
  );
  res.json({ message: 'Messages marked as read' });
};
