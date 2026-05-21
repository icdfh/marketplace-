import { Router } from 'express';
import { addToCart, getCart, removeCartItem, updateCartItem } from '../controllers/cart.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';

export const cartRouter = Router();

cartRouter.use(requireAuth);
cartRouter.get('/', asyncHandler(getCart));
cartRouter.post('/', asyncHandler(addToCart));
cartRouter.patch('/:itemId', asyncHandler(updateCartItem));
cartRouter.delete('/:itemId', asyncHandler(removeCartItem));
