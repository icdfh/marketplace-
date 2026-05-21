import { Router } from 'express';
import { createFeedback, getItemFeedback } from '../controllers/feedback.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';

export const feedbackRouter = Router();

feedbackRouter.get('/item/:itemId', asyncHandler(getItemFeedback));
feedbackRouter.post('/', requireAuth, asyncHandler(createFeedback));
