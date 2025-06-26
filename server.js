import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth/index.js';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { setMaxListeners } from 'events';
import favouriteImagesRoutes from './routes/favouriteImages/index.js';
import jwt from 'jsonwebtoken';
//import job from "./config/cron.js"

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not defined in the environment");
  process.exit(1);
}

setMaxListeners(20);

const app = express();
app.use(express.json());
app.use(cors());

// Static files
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Routes
app.use('/auth', authRoutes);
app.use('/favorites', favouriteImagesRoutes);

app.post('/auth/verify', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token missing' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    res.json({ user });
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
connectDB().then(() => {
  app.listen(process.env.PORT || 5000, () =>
    console.log('Server running...')
  );
}).catch(err => console.error(err));
