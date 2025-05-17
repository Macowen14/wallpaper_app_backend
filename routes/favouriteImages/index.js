import express from 'express';
import { toggleFavorite, getFavorites } from '../../controllers/favouriteImagesController.js';
import { authenticate } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Single endpoint for adding/removing favorites
router.post('/toggle', authenticate, toggleFavorite);

// Get all favorites
router.get('/getFavourites', authenticate, getFavorites);

export default router;