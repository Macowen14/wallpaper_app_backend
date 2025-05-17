import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth/index.js';
import cors from "cors"
import { connectDB } from './config/db.js';
import { setMaxListeners } from 'events';
import favouriteImagesRoutes from "./routes/favouriteImages/index.js"

setMaxListeners(20);


dotenv.config();
const app = express();

app.use(express.json());
app.use(cors())

// Serve static HTML at "/"
const __dirname = path.resolve(); 
app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html at "/"
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Auth routes
app.use('/auth', authRoutes);
app.use (favouriteImagesRoutes)

// Connect to MongoDB and start server
connectDB().then(() => {
  app.listen(process.env.PORT || 5000, () =>
    console.log('Server running...')
  );
}).catch(err => console.error(err));
