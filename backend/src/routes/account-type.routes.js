import express from 'express';
import * as controller from '../controllers/account-type.controller.js';

const router = express.Router();

router.get('/', controller.list);

export default router;
