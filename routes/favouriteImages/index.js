import express from 'express';
import { toggleFavorite, getFavorites } from '../../controllers/favouriteImagesController.js';
import { authenticate } from '../../middleware/authMiddleware.js';

const router = express.Router();


router.post('/favorites/toggle', authenticate, toggleFavorite);
router.get('/favorites', authenticate, getFavorites);

export default router;