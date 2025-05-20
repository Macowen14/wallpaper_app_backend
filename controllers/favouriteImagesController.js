// controllers/favouriteImagesController.js
import User from '../models/User.js';

export const toggleFavorite = async (req, res) => {
  try {
    const { userId } = req.user;
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isFavorite = user.favorites.includes(imageUrl);
    const update = isFavorite
      ? { $pull: { favorites: imageUrl } }
      : { $addToSet: { favorites: imageUrl } };

    const updatedUser = await User.findByIdAndUpdate(userId, update, { new: true });

    res.status(200).json({
      message: isFavorite ? 'Removed from favorites' : 'Added to favorites',
      favorites: updatedUser.favorites,
    });
  } catch (error) {
    console.error('Favorite toggle error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId).select('favorites');

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ favorites: user.favorites });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
