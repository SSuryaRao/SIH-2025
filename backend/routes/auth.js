import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../firebase.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // Check if user already exists
    const userDoc = await db.collection('users').doc(username).get();
    if (userDoc.exists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Save user to Firestore
    await db.collection('users').doc(username).set({
      username,
      passwordHash,
      role: role || 'student'
    });

    res.json({ message: 'Registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Fetch user from Firestore
    const userDoc = await db.collection('users').doc(username).get();
    if (!userDoc.exists) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = userDoc.data();
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { username: user.username, role: user.role || 'student' },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/profile', async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');

    // Fetch user from Firestore
    const userDoc = await db.collection('users').doc(decoded.username).get();
    if (!userDoc.exists) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = userDoc.data();
    const userProfile = {
      username: user.username,
      role: user.role || 'student',
      classLevel: user.classLevel || '12'
    };

    if (user.quizResult) {
      userProfile.quizResult = user.quizResult;
    }

    if (user.profile) {
      userProfile.profile = user.profile;
    }

    res.json(userProfile);
  } catch (error) {
    console.error('Profile error:', error);
    return res.status(401).json({ error: 'Unauthorized' });
  }
});

// PATCH /api/auth/profile - Update user profile
router.patch('/profile', async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    const { classLevel, quizResult } = req.body;

    // Validate classLevel
    if (classLevel && !['10', '12', 'UG', 'PG'].includes(classLevel)) {
      return res.status(400).json({ error: 'Invalid class level' });
    }

    // Fetch user from Firestore to ensure user exists
    const userDoc = await db.collection('users').doc(decoded.username).get();
    if (!userDoc.exists) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Prepare update data
    const updateData = {};
    if (classLevel) {
      updateData.classLevel = classLevel;
    }
    if (quizResult) {
      updateData.quizResult = quizResult;
    }

    // Update user document in Firestore
    await db.collection('users').doc(decoded.username).update(updateData);

    res.json({
      message: 'Profile updated successfully',
      updatedFields: updateData
    });
  } catch (error) {
    console.error('Profile update error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;