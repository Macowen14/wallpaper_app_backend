import User from '../models/User.js';

export const toggleFavorite = async (req, res) => {
  try {
    const { userId } = req.user;
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if image is already favorited
    const isFavorite = user.favorites.includes(imageUrl);

    let updatedUser;
    if (isFavorite) {
      // Remove from favorites
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $pull: { favorites: imageUrl } },
        { new: true }
      );
    } else {
      // Add to favorites
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { favorites: imageUrl } }, // $addToSet prevents duplicates
        { new: true }
      );
    }

    res.status(200).json({
      message: isFavorite ? 'Removed from favorites' : 'Added to favorites',
      favorites: updatedUser.favorites
    });

  } catch (error) {
    console.error('Favorite error:', error);
    res.status(500).json({ error: 'Failed to update favorites' });
  }
};

export const getFavorites = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId).select('favorites');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      favorites: user.favorites || [] // Return empty array if null
    });

  } catch (error) {
    console.error('Error getting favorites:', error);
    res.status(500).json({ error: 'Failed to get favorites' });
  }
};