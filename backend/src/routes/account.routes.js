import express from 'express';
import * as controller from '../controllers/account.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import contextMiddleware from '../middleware/context.middleware.js';
import selectedAccountMiddleware from '../middleware/selected-account.middleware.js';
import * as transactionController from '../controllers/transaction.controller.js';

const router = express.Router();

router.use(authMiddleware);
router.get('/all', controller.listAll);
router.get('/', contextMiddleware, controller.list);
router.post('/', controller.create);
router.post('/select', controller.select);
router.post('/deposit', contextMiddleware, selectedAccountMiddleware, transactionController.deposit);
router.post('/withdraw', contextMiddleware, selectedAccountMiddleware, transactionController.withdraw);

export default router;
