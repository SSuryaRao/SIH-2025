import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health.js';
import authRoutes from './routes/auth.js';
import quizRoutes from './routes/quiz.js';
import coursesRoutes from './routes/courses.js';
import collegesRoutes from './routes/colleges.js';
import timelineRoutes from './routes/timeline.js';
import adminRoutes from './routes/admin.js';
import recommendationsRoutes from './routes/recommendations.js';

const app = express();
const PORT = process.env.PORT || 4000;

// CORS Configuration for production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.FRONTEND_URL || 'https://your-app.vercel.app',
      // Add your Vercel URL here
    ];

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Add a basic health check route
app.get('/', (req, res) => {
  res.json({
    message: 'SIH 2025 Backend API is running!',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/colleges', collegesRoutes);
app.use('/api/timeline', timelineRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/recommendations', recommendationsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});