import { Router } from 'express';
import { addFavorite, getFavorites, removeFavorite } from '../controllers/favorites.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';

export const favoritesRouter = Router();

favoritesRouter.use(requireAuth);
favoritesRouter.get('/', asyncHandler(getFavorites));
favoritesRouter.post('/', asyncHandler(addFavorite));
favoritesRouter.delete('/:itemId', asyncHandler(removeFavorite));
