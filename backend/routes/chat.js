import express from 'express';
import jwt from 'jsonwebtoken';
import geminiService from '../services/geminiService.js';
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

// POST /api/chat/message - Send a message to the chatbot
router.post('/message', requireAuth, async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    const username = req.user.username;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get user context for personalization
    const userContext = await contextService.getUserContext(username);

    // Generate or use provided conversation ID
    const convId = conversationId || contextService.generateConversationId();

    // Get conversation history for context
    const conversationHistory = await contextService.getChatHistory(username, convId, 10);

    // Save user message
    await contextService.saveChatMessage(username, convId, {
      role: 'user',
      content: message.trim()
    });

    // Generate AI response using Gemini
    const aiResponse = await geminiService.generateResponse(
      message.trim(),
      userContext,
      conversationHistory
    );

    if (!aiResponse.success) {
      console.error('Gemini API error:', aiResponse.error);
      return res.status(500).json({
        error: 'Failed to generate response',
        message: aiResponse.response
      });
    }

    // Save AI response
    await contextService.saveChatMessage(username, convId, {
      role: 'assistant',
      content: aiResponse.response
    });

    res.json({
      success: true,
      response: aiResponse.response,
      conversationId: convId,
      timestamp: new Date().toISOString(),
      userContext: {
        stream: userContext.recommendedStream,
        classLevel: userContext.classLevel,
        username: userContext.username
      }
    });

  } catch (error) {
    console.error('Chat message error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Sorry, I encountered an error while processing your message. Please try again.'
    });
  }
});

// GET /api/chat/conversations - Get all conversations for the user
router.get('/conversations', requireAuth, async (req, res) => {
  try {
    const username = req.user.username;
    const conversations = await contextService.getConversations(username);

    res.json({
      success: true,
      conversations: conversations
    });

  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/chat/history/:conversationId - Get messages for a specific conversation
router.get('/history/:conversationId', requireAuth, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const username = req.user.username;
    const limit = parseInt(req.query.limit) || 50;

    const messages = await contextService.getChatHistory(username, conversationId, limit);

    res.json({
      success: true,
      messages: messages,
      conversationId: conversationId
    });

  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/chat/conversations/:conversationId - Delete a conversation
router.delete('/conversations/:conversationId', requireAuth, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const username = req.user.username;

    const success = await contextService.deleteConversation(username, conversationId);

    if (success) {
      res.json({ success: true, message: 'Conversation deleted successfully' });
    } else {
      res.status(404).json({ error: 'Conversation not found' });
    }

  } catch (error) {
    console.error('Delete conversation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/chat/context - Get user context (for debugging/frontend use)
router.get('/context', requireAuth, async (req, res) => {
  try {
    const username = req.user.username;
    const userContext = await contextService.getUserContext(username);

    // Remove sensitive information before sending
    const safeContext = {
      username: userContext.username,
      classLevel: userContext.classLevel,
      recommendedStream: userContext.recommendedStream,
      aptitudeStrengths: userContext.aptitudeStrengths,
      personalityTraits: userContext.personalityTraits,
      hasQuizResult: !!userContext.quizResult
    };

    res.json({
      success: true,
      context: safeContext
    });

  } catch (error) {
    console.error('Get context error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/chat/suggestions - Get quick suggestions based on user context
router.post('/suggestions', requireAuth, async (req, res) => {
  try {
    const username = req.user.username;
    const { category } = req.body; // 'courses', 'colleges', 'careers', 'general'

    const userContext = await contextService.getUserContext(username);

    // Generate contextual suggestions
    const suggestions = await generateSuggestions(userContext, category);

    res.json({
      success: true,
      suggestions: suggestions,
      category: category || 'general'
    });

  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to generate quick suggestions
async function generateSuggestions(userContext, category) {
  const { recommendedStream, classLevel } = userContext;

  const suggestionTemplates = {
    courses: [
      `What ${classLevel === '10' ? 'subjects should I choose for Class 11' : 'courses can I pursue'} in ${recommendedStream}?`,
      `Tell me about the best ${recommendedStream} courses for my level`,
      `What are the career prospects after studying ${recommendedStream}?`
    ],
    colleges: [
      `Which are the top colleges for ${recommendedStream} in India?`,
      `What should I look for when choosing a ${recommendedStream} college?`,
      `Can you suggest colleges near my location for ${recommendedStream}?`
    ],
    careers: [
      `What career options do I have with ${recommendedStream}?`,
      `What's the salary potential in ${recommendedStream} careers?`,
      `Which skills should I develop for a career in ${recommendedStream}?`
    ],
    general: [
      `How can I improve my academic performance?`,
      `What extracurricular activities should I focus on?`,
      `How do I prepare for competitive exams?`,
      `Can you help me create a study plan?`
    ]
  };

  return suggestionTemplates[category] || suggestionTemplates.general;
}

export default router;