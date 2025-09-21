import express from 'express';
const router = express.Router();

router.get('/health', (req, res) => {
  const startTime = process.hrtime.bigint();
  const uptimeSeconds = Number(process.uptime());
  const currentTime = new Date().toISOString();

  res.json({
    status: 'ok',
    uptime: uptimeSeconds,
    time: currentTime
  });
});

export default router;