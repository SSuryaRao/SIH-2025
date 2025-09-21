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
      'secretkey',
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
    const decoded = jwt.verify(token, 'secretkey');

    // Fetch user from Firestore
    const userDoc = await db.collection('users').doc(decoded.username).get();
    if (!userDoc.exists) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = userDoc.data();
    const userProfile = {
      username: user.username,
      role: user.role || 'student'
    };

    if (user.quizResult) {
      userProfile.quizResult = user.quizResult;
    }

    res.json(userProfile);
  } catch (error) {
    console.error('Profile error:', error);
    return res.status(401).json({ error: 'Unauthorized' });
  }
});

export default router;