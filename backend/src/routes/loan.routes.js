import express from 'express';
import * as controller from '../controllers/loan.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import contextMiddleware from '../middleware/context.middleware.js';
import selectedAccountMiddleware from '../middleware/selected-account.middleware.js';

const router = express.Router();

router.use(authMiddleware, contextMiddleware, selectedAccountMiddleware);
router.post('/', controller.create);
router.get('/', controller.list);

export default router;
