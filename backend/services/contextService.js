import db from '../firebase.js';

class ContextService {
  async getUserContext(username) {
    try {
      // Fetch user data from Firestore
      const userDoc = await db.collection('users').doc(username).get();

      if (!userDoc.exists) {
        throw new Error('User not found');
      }

      const userData = userDoc.data();

      // Extract and process user context
      const context = {
        username: userData.username,
        role: userData.role || 'student',
        classLevel: userData.classLevel || '12',
        recommendedStream: userData.quizResult?.recommendedStream || null,
        quizResult: userData.quizResult || null,
        profile: userData.profile || {},
        aptitudeStrengths: this.extractAptitudeStrengths(userData.quizResult),
        personalityTraits: this.extractPersonalityTraits(userData.quizResult),
        streamScores: userData.quizResult?.streamScores || {},
        lastActive: new Date().toISOString()
      };

      return context;
    } catch (error) {
      console.error('Error fetching user context:', error);
      throw error;
    }
  }

  extractAptitudeStrengths(quizResult) {
    if (!quizResult || !quizResult.aptitudeScores) {
      return 'General aptitude';
    }

    const { aptitudeScores } = quizResult;
    const sortedAptitudes = Object.entries(aptitudeScores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2);

    const strengthLabels = {
      logical: 'Logical Reasoning',
      numerical: 'Mathematical Skills',
      verbal: 'Language & Communication',
      spatial: 'Spatial Intelligence'
    };

    return sortedAptitudes
      .map(([key, score]) => `${strengthLabels[key] || key} (${score} points)`)
      .join(', ');
  }

  extractPersonalityTraits(quizResult) {
    if (!quizResult || !quizResult.personalityScores) {
      return 'Balanced personality';
    }

    const { personalityScores } = quizResult;
    const sortedTraits = Object.entries(personalityScores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2);

    const traitLabels = {
      creative: 'Creative Thinking',
      analytical: 'Analytical Mindset',
      leader: 'Leadership Qualities',
      practical: 'Practical Approach'
    };

    return sortedTraits
      .map(([key, score]) => `${traitLabels[key] || key} (${score}/5)`)
      .join(', ');
  }

  async saveChatMessage(username, conversationId, message) {
    try {
      const chatRef = db.collection('chats').doc(username);
      const chatDoc = await chatRef.get();

      const messageData = {
        id: this.generateMessageId(),
        role: message.role, // 'user' or 'assistant'
        content: message.content,
        timestamp: new Date().toISOString(),
        conversationId: conversationId
      };

      if (!chatDoc.exists) {
        // Create new chat document
        await chatRef.set({
          username: username,
          conversations: {
            [conversationId]: {
              id: conversationId,
              messages: [messageData],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              title: this.generateConversationTitle(message.content)
            }
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      } else {
        // Update existing chat document
        const chatData = chatDoc.data();
        const conversations = chatData.conversations || {};

        if (conversations[conversationId]) {
          // Add to existing conversation
          conversations[conversationId].messages.push(messageData);
          conversations[conversationId].updatedAt = new Date().toISOString();
        } else {
          // Create new conversation
          conversations[conversationId] = {
            id: conversationId,
            messages: [messageData],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            title: this.generateConversationTitle(message.content)
          };
        }

        await chatRef.update({
          conversations: conversations,
          updatedAt: new Date().toISOString()
        });
      }

      return messageData;
    } catch (error) {
      console.error('Error saving chat message:', error);
      throw error;
    }
  }

  async getChatHistory(username, conversationId = null, limit = 50) {
    try {
      const chatRef = db.collection('chats').doc(username);
      const chatDoc = await chatRef.get();

      if (!chatDoc.exists) {
        return [];
      }

      const chatData = chatDoc.data();
      const conversations = chatData.conversations || {};

      if (conversationId) {
        // Return specific conversation
        const conversation = conversations[conversationId];
        if (!conversation) return [];

        return conversation.messages
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
          .slice(-limit);
      } else {
        // Return all messages from all conversations
        const allMessages = [];
        Object.values(conversations).forEach(conv => {
          allMessages.push(...conv.messages);
        });

        return allMessages
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
          .slice(-limit);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
      return [];
    }
  }

  async getConversations(username) {
    try {
      const chatRef = db.collection('chats').doc(username);
      const chatDoc = await chatRef.get();

      if (!chatDoc.exists) {
        return [];
      }

      const chatData = chatDoc.data();
      const conversations = chatData.conversations || {};

      return Object.values(conversations)
        .map(conv => ({
          id: conv.id,
          title: conv.title,
          createdAt: conv.createdAt,
          updatedAt: conv.updatedAt,
          messageCount: conv.messages?.length || 0,
          lastMessage: conv.messages?.[conv.messages.length - 1]?.content?.substring(0, 100) || ''
        }))
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  }

  generateMessageId() {
    return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  generateConversationId() {
    return 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  generateConversationTitle(firstMessage) {
    if (!firstMessage) return 'New Conversation';

    // Extract meaningful title from first message
    const words = firstMessage.split(' ').slice(0, 5).join(' ');
    return words.length > 30 ? words.substring(0, 30) + '...' : words;
  }

  async deleteConversation(username, conversationId) {
    try {
      const chatRef = db.collection('chats').doc(username);
      const chatDoc = await chatRef.get();

      if (!chatDoc.exists) {
        throw new Error('Chat document not found');
      }

      const chatData = chatDoc.data();
      const conversations = chatData.conversations || {};

      if (conversations[conversationId]) {
        delete conversations[conversationId];

        await chatRef.update({
          conversations: conversations,
          updatedAt: new Date().toISOString()
        });

        return true;
      }

      return false;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  }

  async getUserRecommendations(username) {
    try {
      // This could integrate with your existing recommendations service
      // For now, we'll return basic recommendations based on user context
      const context = await this.getUserContext(username);

      const recommendations = {
        courses: [],
        colleges: [],
        careers: [],
        timeline: []
      };

      // Add logic here to fetch recommendations based on user context
      // This could call your existing recommendations API internally

      return recommendations;
    } catch (error) {
      console.error('Error fetching user recommendations:', error);
      return { courses: [], colleges: [], careers: [], timeline: [] };
    }
  }
}

export default new ContextService();