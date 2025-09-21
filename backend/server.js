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

app.use(cors());
app.use(express.json());

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