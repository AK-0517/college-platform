import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import collegeRoutes from './routes/colleges';
import authRoutes from './routes/auth';
import savedRoutes from './routes/saved';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/colleges', collegeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/saved', savedRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});