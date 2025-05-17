import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username:{
    type:String,
    required:true,
    trim:true,

  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  favorites: {
    type: [String], // Array of image URLs
    default: []     // Empty array by default
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;