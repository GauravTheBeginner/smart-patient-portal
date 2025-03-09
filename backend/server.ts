
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import patientRoutes from './routes/patientRoutes';
import healthRecordRoutes from './routes/healthRecordRoutes';
import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/records', healthRecordRoutes);
app.use('/api/profile', profileRoutes);

// Base route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the Health Records API' });
});

// Start the server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
  });
}

export default app;
