// routes/favorites.js
import express from 'express';
import { toggleFavorite, getFavorites } from '../../controllers/favouriteImagesController.js';
import { authenticate } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/toggle', authenticate, toggleFavorite);
router.get('/', authenticate, getFavorites);

export default router;
