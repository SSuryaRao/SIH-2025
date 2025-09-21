import express from 'express';
import db from '../firebase.js';

const router = express.Router();

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
}

router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('colleges').get();
    const colleges = [];

    snapshot.forEach(doc => {
      colleges.push({ id: doc.id, ...doc.data() });
    });

    res.json(colleges);
  } catch (error) {
    console.error('Error fetching colleges:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/nearby', async (req, res) => {
  const { lat, lng, radius } = req.query;

  if (!lat || !lng || !radius) {
    return res.status(400).json({ error: 'Missing required parameters: lat, lng, radius' });
  }

  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);
  const searchRadius = parseFloat(radius);

  if (isNaN(userLat) || isNaN(userLng) || isNaN(searchRadius)) {
    return res.status(400).json({ error: 'Invalid parameters: lat, lng, radius must be numbers' });
  }

  try {
    const snapshot = await db.collection('colleges').get();
    const colleges = [];

    snapshot.forEach(doc => {
      colleges.push({ id: doc.id, ...doc.data() });
    });

    const nearbyColleges = colleges.filter(college => {
      const distance = calculateDistance(userLat, userLng, college.latitude, college.longitude);
      return distance <= searchRadius;
    });

    res.json(nearbyColleges);
  } catch (error) {
    console.error('Error fetching nearby colleges:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;