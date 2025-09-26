import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyDMfHGMoHpSATTdNC9Uj4IlzMsM17ZyUhk');
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  async generateResponse(userMessage, userContext, conversationHistory = []) {
    try {
      // Build system prompt with user context
      const systemPrompt = this.buildSystemPrompt(userContext);

      // Format conversation history for context
      const formattedHistory = this.formatConversationHistory(conversationHistory);

      // Combine system prompt, history, and current message
      const fullPrompt = `${systemPrompt}\n\n${formattedHistory}\n\nUser: ${userMessage}\n\nAssistant:`;

      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      return {
        success: true,
        response: text,
        usage: {
          promptTokens: 0, // Gemini doesn't provide token counts in this way
          completionTokens: 0,
          totalTokens: 0
        }
      };
    } catch (error) {
      console.error('Gemini API error:', error);
      return {
        success: false,
        error: error.message,
        response: 'I apologize, but I encountered an error while processing your request. Please try again later.'
      };
    }
  }

  buildSystemPrompt(userContext) {
    const {
      username,
      recommendedStream,
      classLevel,
      quizResult,
      aptitudeStrengths,
      personalityTraits
    } = userContext;

    return `You are CareerGuide AI, a knowledgeable and empathetic career guidance counselor for Indian students. You specialize in providing personalized educational and career advice.

USER PROFILE:
- Name: ${username || 'Student'}
- Recommended Stream: ${recommendedStream || 'Not determined'}
- Class Level: ${classLevel || 'Not specified'}
- Aptitude Strengths: ${aptitudeStrengths || 'General aptitude'}
- Personality Traits: ${personalityTraits || 'Balanced personality'}

CONTEXT ABOUT THE USER'S STREAM:
${this.getStreamContext(recommendedStream, classLevel)}

GUIDELINES:
1. Provide personalized advice based on the user's profile
2. Use encouraging and supportive language
3. Give practical, actionable suggestions
4. Focus on Indian education system and career opportunities
5. Consider the user's class level when suggesting next steps
6. Reference specific courses, colleges, and career paths relevant to their stream
7. Keep responses concise but informative (200-300 words max)
8. If asked about topics outside career guidance, politely redirect to educational/career matters
9. Always end with a follow-up question to continue the conversation

Remember: You're helping shape a student's future, so be thoughtful and encouraging in your responses.`;
  }

  getStreamContext(stream, classLevel) {
    const contexts = {
      'science': {
        '10': 'The user is interested in Science and is currently in Class 10. They should consider PCM (Physics, Chemistry, Math) for engineering or PCB (Physics, Chemistry, Biology) for medical fields.',
        '12': 'The user has a Science background and is in Class 12. They can pursue engineering (B.Tech/B.E.), medical (MBBS), pure sciences (B.Sc), or other technical fields.',
        'UG': 'The user is an undergraduate Science student. They can consider specializations, research opportunities, or prepare for higher studies like M.Tech, M.Sc, or professional courses.',
        'PG': 'The user is a postgraduate Science student. They should focus on research, PhD opportunities, industry positions, or academic careers.'
      },
      'commerce': {
        '10': 'The user is interested in Commerce and is in Class 10. They should consider subjects like Accountancy, Economics, and Business Studies for Class 11.',
        '12': 'The user has a Commerce background and is in Class 12. They can pursue B.Com, BBA, CA, CS, or other business-related courses.',
        'UG': 'The user is an undergraduate Commerce student. They can pursue MBA, M.Com, professional certifications like CA/CS/CMA, or enter the job market.',
        'PG': 'The user is a postgraduate Commerce student. They should focus on senior management roles, consulting, entrepreneurship, or academic positions.'
      },
      'arts': {
        '10': 'The user is interested in Arts/Humanities and is in Class 10. They should consider subjects like History, Political Science, Literature, and Psychology for Class 11.',
        '12': 'The user has an Arts background and is in Class 12. They can pursue B.A., B.F.A., journalism, social work, or civil services preparation.',
        'UG': 'The user is an undergraduate Arts student. They can pursue M.A., civil services, teaching, media, social work, or enter creative industries.',
        'PG': 'The user is a postgraduate Arts student. They should consider civil services, academia, research, policy work, or senior positions in their field of specialization.'
      },
      'vocational': {
        '10': 'The user is interested in Vocational studies and is in Class 10. They should consider technical streams, polytechnic preparation, or skill-based learning.',
        '12': 'The user has a Vocational background and is in Class 12. They can pursue diploma courses, ITI programs, B.Voc, or enter skilled trades.',
        'UG': 'The user is pursuing vocational undergraduate studies. They should focus on industry certifications, apprenticeships, or advanced technical courses.',
        'PG': 'The user has vocational postgraduate qualifications. They should consider supervisory roles, training positions, or entrepreneurship in their specialized field.'
      }
    };

    return contexts[stream]?.[classLevel] || contexts[stream]?.['12'] || 'The user is exploring various educational and career options.';
  }

  formatConversationHistory(history) {
    if (!history || history.length === 0) {
      return 'CONVERSATION HISTORY: This is the start of our conversation.';
    }

    const formattedHistory = history
      .slice(-6) // Keep last 6 messages for context
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    return `CONVERSATION HISTORY:\n${formattedHistory}`;
  }

  async generateStreamingResponse(userMessage, userContext, conversationHistory = []) {
    // For now, return regular response - streaming can be added later
    return this.generateResponse(userMessage, userContext, conversationHistory);
  }
}

export default new GeminiService();
