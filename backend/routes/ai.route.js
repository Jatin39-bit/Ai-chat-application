import {Router} from 'express';
import * as aiController from '../controllers/ai.controller.js';
import * as authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

router.get('/result',authMiddleware.authUser,aiController.aiResponse);

export default router;