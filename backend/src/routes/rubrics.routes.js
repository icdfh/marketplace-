import { Router } from 'express';
import { createRubric, getRubrics } from '../controllers/rubrics.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

export const rubricsRouter = Router();

rubricsRouter.get('/', asyncHandler(getRubrics));
rubricsRouter.post('/', requireAuth, requireRole('admin'), asyncHandler(createRubric));
