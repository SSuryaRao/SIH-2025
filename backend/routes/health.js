import express from 'express';
import db from '../firebase.js';

const router = express.Router();

router.get('/health', async (req, res) => {
  try {
    const startTime = process.hrtime.bigint();
    const uptimeSeconds = Number(process.uptime());
    const currentTime = new Date().toISOString();

    // Test database connection
    await db.collection('health-check').limit(1).get();

    res.json({
      status: 'ok',
      uptime: uptimeSeconds,
      time: currentTime,
      environment: process.env.NODE_ENV || 'development',
      database: 'connected',
      version: '1.0.0'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message,
      time: new Date().toISOString()
    });
  }
});

export default router;