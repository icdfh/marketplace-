import { Router } from 'express';
import { createChat, getChatMessages, getMyChats, markMessagesRead, sendMessage } from '../controllers/chats.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';

export const chatsRouter = Router();

chatsRouter.use(requireAuth);
chatsRouter.get('/', asyncHandler(getMyChats));
chatsRouter.post('/', asyncHandler(createChat));
chatsRouter.get('/:chatId/messages', asyncHandler(getChatMessages));
chatsRouter.post('/:chatId/messages', asyncHandler(sendMessage));
chatsRouter.post('/:chatId/read', asyncHandler(markMessagesRead));
