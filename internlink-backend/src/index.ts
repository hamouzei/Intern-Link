import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import profileRoutes from './routes/profile';
import uploadRoutes from './routes/upload';
import companiesRoutes from './routes/companies';
import applicationsRoutes from './routes/applications';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  "http://localhost:3000",
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith(".vercel.app")
    ) {
      return callback(null, true);
    }
    
    return callback(null, false);
  },
  credentials: true,
}));

app.use(express.json());

// Routes
app.use('/profile', profileRoutes);
app.use('/upload', uploadRoutes);
app.use('/companies', companiesRoutes);
app.use('/applications', applicationsRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
