import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRouter from './routes/auth.js';
import eventRouter from './routes/events.js';
import ticketRouter from './routes/tickets.js';

dotenv.config();

const app = express();

// ✅ Allowed frontend URLs
const allowedOrigins = [
  "http://localhost:5173",                 // Local dev
  "https://frontend2-bay-eta.vercel.app"   // Vercel frontend (no trailing slash!)
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Allow tools like Postman
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true, service: 'EventX Backend' }));

// Routers
app.use('/api/auth', authRouter);
app.use('/api/events', eventRouter);
app.use('/api/tickets', ticketRouter);

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventx';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB', err);
    process.exit(1);
  });
