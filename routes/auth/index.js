import { Router } from 'express';
import { authenticate } from '../../middleware/authMiddleware.js';
import {authorizeAdmin} from "../../middleware/authorizeAdmin.js"
const router = Router();
import {register, login} from "../../controllers/authController.js"
import { getAllUsers, getUserById } from '../../controllers/userController.js';



router.post('/register', register);
router.post('/login', login);

// 🔐 Protected route - only for admin
router.get('/users', authenticate, authorizeAdmin, getAllUsers);

// Protected route to get user details
router.get('/users/:id', authenticate, getUserById);

export default router;
