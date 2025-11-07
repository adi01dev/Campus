import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import { connectDB } from './db';
import authRoutes from './routes/auth';
import { PORT } from './config';
import adminRoutes from './routes/admin';
import facultyRoutes from './routes/faculty';

dotenv.config();
const app = express();

app.use(helmet());
app.use(express.json());

// ✅ CORS FIX
app.use(
  cors({
    origin: ['http://localhost:8080'], // your frontend URL(s)
    credentials: true,
  })
);


app.use('/api/faculty', facultyRoutes);




app.use('/api/admin', adminRoutes);

app.use('/api/auth', authRoutes);

app.get('/health', (_, res) => res.json({ status: 'ok' }));

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
