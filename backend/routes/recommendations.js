import express from 'express';
import jwt from 'jsonwebtoken';
import db from '../firebase.js';

const router = express.Router();

// Middleware to verify JWT token
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, 'secretkey');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// GET /api/recommendations - Get personalized recommendations
router.get('/', requireAuth, async (req, res) => {
  try {
    // Fetch user profile from Firestore
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('username', '==', req.user.username).get();

    if (snapshot.empty) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    // Check if user has taken the quiz
    if (!userData.quizResult || !userData.quizResult.recommendedStream) {
      return res.json({ message: "Take the quiz to get recommendations" });
    }

    const recommendedStream = userData.quizResult.recommendedStream;
    const today = new Date().toISOString().split('T')[0];

    // Get recommended courses based on stream
    const coursesSnapshot = await db.collection('courses').get();
    const allCourses = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Simple mapping logic for stream-to-course recommendations
    const streamCourseMapping = {
      'science': ['B.Sc.', 'B.Tech', 'MBBS', 'B.E.'],
      'arts': ['B.A.', 'B.F.A.', 'B.S.W.', 'B.J.M.C.'],
      'commerce': ['B.Com', 'BBA', 'B.C.A.', 'CA'],
      'vocational': ['Diploma', 'ITI', 'Polytechnic', 'Certificate']
    };

    const relevantCourseNames = streamCourseMapping[recommendedStream] || [];
    const recommendedCourses = allCourses.filter(course =>
      relevantCourseNames.some(name =>
        course.course.toLowerCase().includes(name.toLowerCase())
      )
    ).slice(0, 3); // Top 3 courses

    // Get colleges offering recommended courses
    const collegesSnapshot = await db.collection('colleges').get();
    const allColleges = collegesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const recommendedColleges = allColleges.filter(college =>
      college.courses.some(collegeCourse =>
        recommendedCourses.some(recCourse =>
          collegeCourse.toLowerCase().includes(recCourse.course.toLowerCase()) ||
          recCourse.course.toLowerCase().includes(collegeCourse.toLowerCase())
        )
      )
    ).slice(0, 5); // Top 5 colleges

    // Get upcoming timeline events
    const timelineSnapshot = await db.collection('timeline').get();
    const allEvents = timelineSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const upcomingEvents = allEvents
      .filter(event => event.date >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5); // Next 5 events

    res.json({
      recommendedStream,
      courses: recommendedCourses,
      colleges: recommendedColleges,
      upcomingEvents
    });

  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;