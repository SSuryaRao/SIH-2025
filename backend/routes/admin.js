import express from 'express';
import jwt from 'jsonwebtoken';
import db from '../firebase.js';

const router = express.Router();

// Middleware to check admin role
function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, 'secretkey');

    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// POST /api/admin/timeline - Create new timeline event
router.post('/timeline', requireAdmin, async (req, res) => {
  const { title, date, type } = req.body;

  if (!title || !date || !type) {
    return res.status(400).json({ error: 'Missing required fields: title, date, type' });
  }

  if (!['admission', 'scholarship'].includes(type)) {
    return res.status(400).json({ error: 'Type must be "admission" or "scholarship"' });
  }

  try {
    const docRef = await db.collection('timeline').add({
      title,
      date,
      type
    });

    res.json({ id: docRef.id, title, date, type });
  } catch (error) {
    console.error('Error creating timeline event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/admin/timeline/:id - Update timeline event
router.put('/timeline/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, date, type } = req.body;

  if (!title || !date || !type) {
    return res.status(400).json({ error: 'Missing required fields: title, date, type' });
  }

  if (!['admission', 'scholarship'].includes(type)) {
    return res.status(400).json({ error: 'Type must be "admission" or "scholarship"' });
  }

  try {
    const docRef = db.collection('timeline').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Timeline event not found' });
    }

    await docRef.update({
      title,
      date,
      type
    });

    res.json({ id, title, date, type });
  } catch (error) {
    console.error('Error updating timeline event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/admin/timeline/:id - Delete timeline event
router.delete('/timeline/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const docRef = db.collection('timeline').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Timeline event not found' });
    }

    await docRef.delete();
    res.json({ message: 'Timeline event deleted successfully' });
  } catch (error) {
    console.error('Error deleting timeline event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/admin/courses - Create new course
router.post('/courses', requireAdmin, async (req, res) => {
  const { course, careers, higherStudies } = req.body;

  if (!course || !careers || !higherStudies) {
    return res.status(400).json({ error: 'Missing required fields: course, careers, higherStudies' });
  }

  if (!Array.isArray(careers) || !Array.isArray(higherStudies)) {
    return res.status(400).json({ error: 'careers and higherStudies must be arrays' });
  }

  try {
    const docRef = await db.collection('courses').add({
      course,
      careers,
      higherStudies
    });

    res.json({ id: docRef.id, course, careers, higherStudies });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/admin/courses/:id - Update course
router.put('/courses/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { course, careers, higherStudies } = req.body;

  if (!course || !careers || !higherStudies) {
    return res.status(400).json({ error: 'Missing required fields: course, careers, higherStudies' });
  }

  if (!Array.isArray(careers) || !Array.isArray(higherStudies)) {
    return res.status(400).json({ error: 'careers and higherStudies must be arrays' });
  }

  try {
    const docRef = db.collection('courses').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Course not found' });
    }

    await docRef.update({
      course,
      careers,
      higherStudies
    });

    res.json({ id, course, careers, higherStudies });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/admin/courses/:id - Delete course
router.delete('/courses/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const docRef = db.collection('courses').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Course not found' });
    }

    await docRef.delete();
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/admin/colleges - Create new college
router.post('/colleges', requireAdmin, async (req, res) => {
  const { name, location, latitude, longitude, courses, facilities } = req.body;

  if (!name || !location || latitude === undefined || longitude === undefined || !courses || !facilities) {
    return res.status(400).json({ error: 'Missing required fields: name, location, latitude, longitude, courses, facilities' });
  }

  if (!Array.isArray(courses) || !Array.isArray(facilities)) {
    return res.status(400).json({ error: 'courses and facilities must be arrays' });
  }

  if (isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) {
    return res.status(400).json({ error: 'latitude and longitude must be numbers' });
  }

  try {
    const docRef = await db.collection('colleges').add({
      name,
      location,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      courses,
      facilities
    });

    res.json({ id: docRef.id, name, location, latitude: parseFloat(latitude), longitude: parseFloat(longitude), courses, facilities });
  } catch (error) {
    console.error('Error creating college:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/admin/colleges/:id - Update college
router.put('/colleges/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, location, latitude, longitude, courses, facilities } = req.body;

  if (!name || !location || latitude === undefined || longitude === undefined || !courses || !facilities) {
    return res.status(400).json({ error: 'Missing required fields: name, location, latitude, longitude, courses, facilities' });
  }

  if (!Array.isArray(courses) || !Array.isArray(facilities)) {
    return res.status(400).json({ error: 'courses and facilities must be arrays' });
  }

  if (isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) {
    return res.status(400).json({ error: 'latitude and longitude must be numbers' });
  }

  try {
    const docRef = db.collection('colleges').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'College not found' });
    }

    await docRef.update({
      name,
      location,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      courses,
      facilities
    });

    res.json({ id, name, location, latitude: parseFloat(latitude), longitude: parseFloat(longitude), courses, facilities });
  } catch (error) {
    console.error('Error updating college:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/admin/colleges/:id - Delete college
router.delete('/colleges/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const docRef = db.collection('colleges').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'College not found' });
    }

    await docRef.delete();
    res.json({ message: 'College deleted successfully' });
  } catch (error) {
    console.error('Error deleting college:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;