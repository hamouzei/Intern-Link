import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { db } from './db';
import profileRoutes from './routes/profile';
import uploadRoutes from './routes/upload';
import companiesRoutes from './routes/companies';
import applicationsRoutes from './routes/applications';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/profile', profileRoutes);
app.use('/upload', uploadRoutes);
app.use('/companies', companiesRoutes);
app.use('/applications', applicationsRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
