import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  username :{type :String, required:true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Array of image URLs (strings)
  favouriteImages: [{ type: String }]
}, { timestamps: true });

export default model('User', userSchema);
