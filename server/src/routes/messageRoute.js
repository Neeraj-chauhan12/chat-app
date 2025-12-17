import express from 'express';
import { authMiddleware } from '../middleware/AuthMiddleware.js';
import { sendMessage, getMessages } from '../controllers/messageControllers.js';

const router=express.Router();

router.post('/send/:id',authMiddleware,sendMessage)
router.get('/get/:id',authMiddleware,getMessages)

export default router;