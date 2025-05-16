import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth/index.js';
import cors from "cors"
import jwt from 'jsonwebtoken';
import { connectDB } from './config/db.js';
import { setMaxListeners } from 'events';

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

// Example of protected route middleware (optional)

function protect(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Connect to MongoDB and start server
connectDB().then(() => {
  app.listen(process.env.PORT || 5000, () =>
    console.log('Server running...')
  );
}).catch(err => console.error(err));
