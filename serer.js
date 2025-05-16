require('dotenv').config();
import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';

import authRoutes from './routes/auth';

const app = express();
app.use(cors());
app.use(json());

connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
