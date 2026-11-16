import express from 'express';
import * as controller from '../controllers/transaction.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import contextMiddleware from '../middleware/context.middleware.js';
import selectedAccountMiddleware from '../middleware/selected-account.middleware.js';

const router = express.Router();

router.use(authMiddleware, contextMiddleware, selectedAccountMiddleware);
router.post('/deposit', controller.deposit);
router.post('/withdraw', controller.withdraw);
router.post('/transfer', controller.transfer);
router.get('/', controller.history);

export default router;
