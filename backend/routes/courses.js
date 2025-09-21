import express from 'express';
import db from '../firebase.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('courses').get();
    const courses = [];

    snapshot.forEach(doc => {
      courses.push({ id: doc.id, ...doc.data() });
    });

    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:courseName', async (req, res) => {
  const { courseName } = req.params;

  try {
    const snapshot = await db.collection('courses').get();
    let foundCourse = null;

    snapshot.forEach(doc => {
      const course = doc.data();
      if (course.course.toLowerCase().replace(/\./g, '') === courseName.toLowerCase().replace(/\./g, '')) {
        foundCourse = { id: doc.id, ...course };
      }
    });

    if (!foundCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(foundCourse);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;