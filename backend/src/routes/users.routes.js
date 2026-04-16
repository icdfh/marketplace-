import { Router } from 'express';
import { getPublicUser, updateProfile } from '../controllers/users.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';

export const usersRouter = Router();

usersRouter.get('/:id', asyncHandler(getPublicUser));
usersRouter.patch('/me/profile', requireAuth, asyncHandler(updateProfile));
