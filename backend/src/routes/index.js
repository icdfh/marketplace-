import { Router } from 'express';
import { authRouter } from './auth.routes.js';
import { itemsRouter } from './items.routes.js';
import { rubricsRouter } from './rubrics.routes.js';
import { favoritesRouter } from './favorites.routes.js';
import { cartRouter } from './cart.routes.js';
import { feedbackRouter } from './feedback.routes.js';
import { chatsRouter } from './chats.routes.js';
import { usersRouter } from './users.routes.js';

export const router = Router();

router.use('/auth', authRouter);
router.use('/items', itemsRouter);
router.use('/rubrics', rubricsRouter);
router.use('/favorites', favoritesRouter);
router.use('/cart', cartRouter);
router.use('/feedback', feedbackRouter);
router.use('/chats', chatsRouter);
router.use('/users', usersRouter);
