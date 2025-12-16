const express=require('express');
const { authMiddleware } = require('../middleware/AuthMiddleware');
const { sendMessage, getMessages } = require('../controllers/messageControllers');
const router=express.Router()

router.post('/send/:id',authMiddleware,sendMessage)
router.get('/get/:id',authMiddleware,getMessages)



module.exports=router;