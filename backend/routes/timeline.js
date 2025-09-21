import express from 'express';
import db from '../firebase.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('timeline').get();
    const events = [];

    snapshot.forEach(doc => {
      events.push({ id: doc.id, ...doc.data() });
    });

    const sortedEvents = events.sort((a, b) => new Date(a.date) - new Date(b.date));
    res.json(sortedEvents);
  } catch (error) {
    console.error('Error fetching timeline:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/upcoming', async (req, res) => {
  const { from } = req.query;

  if (!from) {
    return res.status(400).json({ error: 'Missing required parameter: from (YYYY-MM-DD)' });
  }

  const fromDate = new Date(from);
  if (isNaN(fromDate.getTime())) {
    return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
  }

  try {
    const snapshot = await db.collection('timeline').get();
    const events = [];

    snapshot.forEach(doc => {
      events.push({ id: doc.id, ...doc.data() });
    });

    const upcomingEvents = events
      .filter(event => new Date(event.date) >= fromDate)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json(upcomingEvents);
  } catch (error) {
    console.error('Error fetching upcoming timeline:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;