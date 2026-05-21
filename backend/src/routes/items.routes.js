import { Router } from 'express';
import { createItem, deleteItem, getItemById, getItems, updateItem } from '../controllers/items.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

export const itemsRouter = Router();

itemsRouter.get('/', asyncHandler(getItems));
itemsRouter.get('/:id', asyncHandler(getItemById));
itemsRouter.post('/', requireAuth, requireRole('seller', 'admin'), asyncHandler(createItem));
itemsRouter.patch('/:id', requireAuth, requireRole('seller', 'admin'), asyncHandler(updateItem));
itemsRouter.delete('/:id', requireAuth, requireRole('seller', 'admin'), asyncHandler(deleteItem));
