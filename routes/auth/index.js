import { Router } from 'express';
const router = Router();
import {register, login} from "../../controllers/authController.js"

router.post('/auth/register', register);
router.post('/auth/login', login);

export default router;
