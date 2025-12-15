const express=require('express');
const { registerUser, loginUser, logoutUser, getUserProfile, getAllUsers } = require('../controllers/userControllers');
const { authMiddleware } = require('../middleware/AuthMiddleware');
const router=express.Router();

router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/logout',logoutUser)
router.get('/getProfile',authMiddleware,getUserProfile)
router.get('/allUsers',authMiddleware,getAllUsers)

module.exports=router;