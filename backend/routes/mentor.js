import express from 'express';
import jwt from 'jsonwebtoken';
import mentorAI from '../services/mentorAI.js';
import contextService from '../services/contextService.js';

const router = express.Router();

// Middleware to verify JWT token
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
}

// POST /api/mentor/chat - Chat with virtual mentor
router.post('/chat', requireAuth, async (req, res) => {
  try {
    const { message, mentorType = 'engineer', conversationId, emotionalState = 'neutral' } = req.body;
    const username = req.user.username;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get user context for personalization
    const userContext = await contextService.getUserContext(username);

    // Generate or use provided conversation ID
    const convId = conversationId || `mentor_${mentorType}_${Date.now()}`;

    // Get conversation history for context
    const conversationHistory = await contextService.getChatHistory(username, convId, 6);

    // Save user message to context service
    await contextService.saveChatMessage(username, convId, {
      role: 'user',
      content: message.trim(),
      mentorType: mentorType
    });

    // Generate mentor response
    const mentorResponse = await mentorAI.generateMentorResponse(
      message.trim(),
      mentorType,
      userContext,
      conversationHistory,
      emotionalState
    );

    if (!mentorResponse.success) {
      console.error('Mentor AI error:', mentorResponse.error);
      return res.status(500).json({
        error: 'Failed to generate mentor response',
        message: 'I apologize, but I encountered an error. Please try again.'
      });
    }

    // Save mentor response
    await contextService.saveChatMessage(username, convId, {
      role: 'assistant',
      content: mentorResponse.text,
      mentorType: mentorType,
      emotion: mentorResponse.emotion
    });

    // Prepare response
    const response = {
      success: true,
      message: mentorResponse.text,
      mentor: {
        name: mentorResponse.mentorName,
        title: mentorResponse.mentorTitle,
        type: mentorType,
        emotion: mentorResponse.emotion
      },
      conversationId: convId,
      suggestions: mentorResponse.suggestions,
      responseData: mentorResponse.responseData,
      timestamp: new Date().toISOString(),
      userContext: {
        stream: userContext.recommendedStream,
        classLevel: userContext.classLevel,
        username: userContext.username
      }
    };

    res.json(response);

  } catch (error) {
    console.error('Mentor chat error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Sorry, I encountered an error while processing your message. Please try again.'
    });
  }
});

// GET /api/mentor/types - Get available mentor types
router.get('/types', requireAuth, async (req, res) => {
  try {
    const mentors = mentorAI.getAvailableMentors();

    res.json({
      success: true,
      mentors: mentors.map(mentor => ({
        type: mentor.type,
        name: mentor.name,
        title: mentor.title,
        personality: mentor.personality,
        expertise: mentor.expertise,
        background: mentor.background.substring(0, 100) + '...'
      }))
    });

  } catch (error) {
    console.error('Get mentor types error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/mentor/info/:type - Get detailed mentor information
router.get('/info/:type', requireAuth, async (req, res) => {
  try {
    const { type } = req.params;
    const mentorInfo = mentorAI.getMentorInfo(type);

    if (!mentorInfo) {
      return res.status(404).json({ error: 'Mentor type not found' });
    }

    res.json({
      success: true,
      mentor: {
        type: type,
        ...mentorInfo,
        // Add additional info for frontend
        avatar: `/avatars/${type}.png`, // You can add avatar images later
        specialties: mentorInfo.expertise,
        approachStyle: mentorInfo.speaking_style
      }
    });

  } catch (error) {
    console.error('Get mentor info error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/mentor/recommend - Get recommended mentor based on user profile
router.post('/recommend', requireAuth, async (req, res) => {
  try {
    const username = req.user.username;
    const userContext = await contextService.getUserContext(username);

    // Logic to recommend best mentor type based on user profile
    let recommendedMentorType = 'engineer'; // default

    if (userContext.recommendedStream) {
      const streamMentorMap = {
        'science': 'engineer',
        'commerce': 'business',
        'arts': 'teacher',
        'vocational': 'engineer'
      };
      recommendedMentorType = streamMentorMap[userContext.recommendedStream] || 'engineer';
    }

    // Get mentor info
    const mentorInfo = mentorAI.getMentorInfo(recommendedMentorType);

    res.json({
      success: true,
      recommendedMentor: {
        type: recommendedMentorType,
        ...mentorInfo,
        reason: `Based on your ${userContext.recommendedStream} stream and interests, ${mentorInfo.name} would be an excellent mentor to guide your career journey.`,
        matchScore: 0.95 // You could implement actual matching logic
      },
      alternatives: mentorAI.getAvailableMentors()
        .filter(m => m.type !== recommendedMentorType)
        .slice(0, 2)
        .map(mentor => ({
          type: mentor.type,
          name: mentor.name,
          title: mentor.title,
          matchScore: Math.random() * 0.3 + 0.6 // Mock scores
        }))
    });

  } catch (error) {
    console.error('Mentor recommendation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/mentor/conversations - Get mentor conversations for user
router.get('/conversations', requireAuth, async (req, res) => {
  try {
    const username = req.user.username;
    const conversations = await contextService.getConversations(username);

    // Filter mentor conversations and add mentor info
    const mentorConversations = conversations
      .filter(conv => conv.id.includes('mentor_'))
      .map(conv => {
        const mentorType = conv.id.split('_')[1] || 'engineer';
        const mentorInfo = mentorAI.getMentorInfo(mentorType);

        return {
          ...conv,
          mentorType,
          mentorName: mentorInfo.name,
          mentorTitle: mentorInfo.title
        };
      });

    res.json({
      success: true,
      conversations: mentorConversations
    });

  } catch (error) {
    console.error('Get mentor conversations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/mentor/feedback - Submit feedback about mentor interaction
router.post('/feedback', requireAuth, async (req, res) => {
  try {
    const { conversationId, mentorType, rating, feedback, helpful } = req.body;
    const username = req.user.username;

    // Here you could store feedback for improving the mentor AI
    // For now, we'll just acknowledge it
    console.log('Mentor feedback received:', {
      username,
      conversationId,
      mentorType,
      rating,
      feedback,
      helpful,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Thank you for your feedback! It helps us improve the mentor experience.'
    });

  } catch (error) {
    console.error('Mentor feedback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/mentor/analytics/:type - Get mentor usage analytics (for admin)
router.get('/analytics/:type', requireAuth, async (req, res) => {
  try {
    const { type } = req.params;

    // Mock analytics data - in real implementation, you'd query your database
    const analytics = {
      mentorType: type,
      totalConversations: Math.floor(Math.random() * 1000) + 100,
      averageRating: (Math.random() * 1.5 + 3.5).toFixed(1),
      popularTopics: [
        'Career guidance',
        'Course selection',
        'Skill development',
        'Job prospects'
      ],
      userSatisfaction: (Math.random() * 20 + 80).toFixed(1) + '%',
      responseTime: '< 2 seconds',
      conversationLength: '8.5 messages avg'
    };

    res.json({
      success: true,
      analytics
    });

  } catch (error) {
    console.error('Mentor analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;