import express from 'express';
import * as controller from '../controllers/auth.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import contextMiddleware from '../middleware/context.middleware.js';

const router = express.Router();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.get('/me', authMiddleware, contextMiddleware, controller.me);

export default router;
