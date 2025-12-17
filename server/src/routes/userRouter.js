import express from 'express';
import { registerUser, loginUser, logoutUser, getUserProfile, getAllUsers } from '../controllers/userControllers.js';
import { authMiddleware } from '../middleware/AuthMiddleware.js';

const router=express.Router();

router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/logout',logoutUser)
router.get('/getProfile',authMiddleware,getUserProfile)
router.get('/allUsers',authMiddleware,getAllUsers)

export default router;