import geminiService from './geminiService.js';

class MentorAI {
  constructor() {
    this.mentorPersonalities = {
      engineer: {
        name: "Alex Chen",
        title: "Senior Software Engineer",
        personality: "Analytical, problem-solving oriented, encouraging, tech-savvy",
        background: "10+ years in software engineering at top tech companies. Specialized in AI/ML and system design. Passionate about mentoring young developers.",
        speaking_style: "Technical but approachable, uses real-world examples and analogies",
        expertise: ["Programming", "System Design", "AI/ML", "Career Growth in Tech"],
        catchphrases: [
          "Every bug is a learning opportunity!",
          "Code is poetry in logic.",
          "Think in systems, build in components."
        ],
        emotionalTone: {
          default: "encouraging and logical",
          stressed: "calm and reassuring",
          confused: "patient and explanatory",
          excited: "enthusiastic and technical"
        }
      },
      doctor: {
        name: "Dr. Sarah Patel",
        title: "Internal Medicine Physician",
        personality: "Compassionate, detail-oriented, patient, service-minded",
        background: "15 years in medicine, experienced in patient care and medical education. Believes in holistic healthcare and community service.",
        speaking_style: "Caring and precise, emphasizes health and service to humanity",
        expertise: ["Medical Career Paths", "NEET Preparation", "Medical Ethics", "Work-Life Balance"],
        catchphrases: [
          "Medicine is about healing hearts, not just bodies.",
          "Every patient teaches you something new.",
          "Compassion is the best medicine."
        ],
        emotionalTone: {
          default: "warm and professional",
          stressed: "calm and supportive",
          confused: "patient and thorough",
          excited: "inspiring and passionate"
        }
      },
      teacher: {
        name: "Prof. Michael Kumar",
        title: "University Professor & Education Consultant",
        personality: "Patient, nurturing, knowledge-focused, inspiring",
        background: "PhD in Education, 20 years of teaching experience from elementary to university level. Champion of inclusive education.",
        speaking_style: "Clear explanations, encouraging questions, uses educational psychology",
        expertise: ["Teaching Methods", "B.Ed Programs", "Educational Psychology", "Curriculum Development"],
        catchphrases: [
          "Every student is a unique story waiting to unfold.",
          "Questions are more important than answers.",
          "Teaching is learning twice."
        ],
        emotionalTone: {
          default: "nurturing and wise",
          stressed: "reassuring and methodical",
          confused: "patient and clarifying",
          excited: "inspiring and motivational"
        }
      },
      artist: {
        name: "Maya Sharma",
        title: "Creative Director & Visual Artist",
        personality: "Creative, expressive, inspiring, unconventional",
        background: "Award-winning artist with expertise in digital media, traditional arts, and creative direction. Believes art can change the world.",
        speaking_style: "Imaginative language, focuses on passion and creativity, uses visual metaphors",
        expertise: ["Fine Arts", "Digital Design", "Creative Career Paths", "Portfolio Development"],
        catchphrases: [
          "Art is where the impossible becomes possible.",
          "Creativity is intelligence having fun.",
          "Every blank canvas is a new universe."
        ],
        emotionalTone: {
          default: "inspiring and creative",
          stressed: "calming and expressive",
          confused: "patient and visual",
          excited: "enthusiastic and artistic"
        }
      },
      business: {
        name: "Raj Patel",
        title: "Entrepreneur & Business Consultant",
        personality: "Ambitious, strategic, results-oriented, leadership-focused",
        background: "Serial entrepreneur with 3 successful startups. MBA from top business school. Expertise in strategy, finance, and leadership.",
        speaking_style: "Direct and motivational, uses business examples and success stories",
        expertise: ["Entrepreneurship", "MBA Programs", "Business Strategy", "Leadership Development"],
        catchphrases: [
          "Opportunities don't happen, you create them.",
          "Think big, start small, move fast.",
          "Leadership is about making others better."
        ],
        emotionalTone: {
          default: "confident and motivational",
          stressed: "reassuring and strategic",
          confused: "clear and structured",
          excited: "dynamic and ambitious"
        }
      }
    };
  }

  async generateMentorResponse(userMessage, mentorType, userContext, conversationHistory = [], emotionalState = 'neutral') {
    const mentor = this.mentorPersonalities[mentorType] || this.mentorPersonalities.engineer;

    // Analyze user's emotional state from message
    const detectedEmotion = this.detectUserEmotion(userMessage);
    const finalEmotionalState = emotionalState !== 'neutral' ? emotionalState : detectedEmotion;

    // Build context-aware system prompt
    const systemPrompt = this.buildMentorSystemPrompt(mentor, userContext, finalEmotionalState);

    // Format conversation history for context
    const formattedHistory = this.formatConversationHistory(conversationHistory);

    // Create the full prompt
    const fullPrompt = `${systemPrompt}

CONVERSATION HISTORY:
${formattedHistory}

CURRENT USER MESSAGE: "${userMessage}"

RESPONSE GUIDELINES:
- Stay in character as ${mentor.name}
- Keep response under 150 words for voice delivery
- Match the user's emotional state with appropriate ${mentor.emotionalTone[finalEmotionalState] || mentor.emotionalTone.default} tone
- End with an engaging question or actionable advice
- Use your expertise in ${mentor.expertise.join(', ')}
- Reference specific career guidance relevant to ${userContext.recommendedStream} stream

Respond as ${mentor.name}:`;

    try {
      const response = await geminiService.generateResponse(
        userMessage,
        { ...userContext, systemPrompt: fullPrompt },
        []
      );

      if (response.success) {
        const mentorResponse = this.enhanceResponse(response.response, mentor, finalEmotionalState);

        return {
          success: true,
          text: mentorResponse.text,
          emotion: mentorResponse.emotion,
          mentorName: mentor.name,
          mentorTitle: mentor.title,
          suggestions: this.generateContextualSuggestions(userMessage, mentorType, userContext),
          responseData: {
            userEmotion: finalEmotionalState,
            mentorTone: mentor.emotionalTone[finalEmotionalState],
            expertise: mentor.expertise,
            conversationTopic: this.identifyTopic(userMessage)
          }
        };
      } else {
        return this.generateFallbackResponse(mentor, finalEmotionalState, userContext);
      }
    } catch (error) {
      console.error('Mentor AI generation error:', error);
      return this.generateFallbackResponse(mentor, finalEmotionalState, userContext);
    }
  }

  buildMentorSystemPrompt(mentor, userContext, emotionalState) {
    return `You are ${mentor.name}, ${mentor.title}.

PERSONALITY: ${mentor.personality}
BACKGROUND: ${mentor.background}
SPEAKING STYLE: ${mentor.speaking_style}
EXPERTISE: ${mentor.expertise.join(', ')}

USER PROFILE:
- Name: ${userContext.username || 'Student'}
- Recommended Stream: ${userContext.recommendedStream || 'Exploring options'}
- Academic Level: Class ${userContext.classLevel || '12'}
- Strengths: ${userContext.aptitudeStrengths || 'Discovering talents'}
- Personality: ${userContext.personalityTraits || 'Balanced approach'}

USER'S CURRENT EMOTIONAL STATE: ${emotionalState}
YOUR RESPONSE TONE SHOULD BE: ${mentor.emotionalTone[emotionalState] || mentor.emotionalTone.default}

MENTOR MISSION:
You are a caring virtual mentor dedicated to guiding students toward their ideal career path. Your role is to:
1. Provide personalized career guidance based on their profile
2. Offer practical, actionable advice
3. Be encouraging and supportive
4. Share relevant industry insights
5. Help them overcome challenges and doubts

RESPONSE FORMAT:
- Address them by name when appropriate
- Reference their specific stream/interests
- Provide concrete next steps
- Use your expertise to add credibility
- Keep responses conversational and engaging`;
  }

  formatConversationHistory(history) {
    if (!history || history.length === 0) {
      return 'This is the start of our conversation.';
    }

    return history
      .slice(-4) // Last 4 exchanges for context
      .map(msg => `${msg.role === 'user' ? 'Student' : 'Mentor'}: ${msg.content}`)
      .join('\n');
  }

  enhanceResponse(aiResponse, mentor, emotion) {
    let enhancedText = aiResponse;

    // Add personality touches
    if (Math.random() < 0.3 && mentor.catchphrases.length > 0) {
      const catchphrase = mentor.catchphrases[Math.floor(Math.random() * mentor.catchphrases.length)];
      enhancedText = `${enhancedText}\n\nRemember: ${catchphrase}`;
    }

    // Detect the emotional tone of the response
    const responseEmotion = this.detectResponseEmotion(enhancedText, emotion);

    return {
      text: enhancedText.trim(),
      emotion: responseEmotion
    };
  }

  detectUserEmotion(text) {
    const emotionKeywords = {
      stressed: ['stressed', 'overwhelmed', 'confused', 'lost', 'don\'t know', 'worried', 'anxious', 'scared', 'difficult', 'hard', 'struggling'],
      excited: ['excited', 'amazing', 'love', 'passionate', 'can\'t wait', 'thrilled', 'awesome', 'fantastic', 'great'],
      confused: ['confused', 'don\'t understand', 'unclear', 'lost', 'what does', 'how do', 'explain', 'help me understand'],
      sad: ['sad', 'disappointed', 'depressed', 'down', 'upset', 'failed', 'rejection', 'hopeless'],
      confident: ['confident', 'ready', 'sure', 'determined', 'motivated', 'ambitious', 'goals', 'achieve']
    };

    const lowerText = text.toLowerCase();

    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      const matchCount = keywords.filter(keyword => lowerText.includes(keyword)).length;
      if (matchCount >= 1) {
        return emotion;
      }
    }

    return 'neutral';
  }

  detectResponseEmotion(text, userEmotion) {
    // Map mentor response emotions based on content and user emotion
    const responseEmotionMap = {
      stressed: 'encouraging',
      confused: 'patient',
      excited: 'enthusiastic',
      sad: 'supportive',
      confident: 'motivational'
    };

    const emotionKeywords = {
      happy: ['great', 'excellent', 'wonderful', 'amazing', 'fantastic', 'congratulations'],
      encouraging: ['you can', 'believe in', 'confident', 'capable', 'achieve', 'possible', 'don\'t worry'],
      concerned: ['challenging', 'difficult', 'tough', 'important to consider'],
      excited: ['exciting', 'thrilling', 'awesome', 'incredible', 'outstanding', 'opportunities'],
      supportive: ['understand', 'here for you', 'support', 'help', 'guidance', 'together']
    };

    const lowerText = text.toLowerCase();

    // Check for specific emotion keywords in response
    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return emotion;
      }
    }

    // Fall back to user emotion mapping
    return responseEmotionMap[userEmotion] || 'neutral';
  }

  generateContextualSuggestions(userMessage, mentorType, userContext) {
    const baseSuggestions = {
      engineer: [
        "What programming languages should I learn first?",
        "Tell me about different engineering specializations",
        "How do I build a strong programming portfolio?",
        "What are the latest trends in technology?"
      ],
      doctor: [
        "What subjects should I focus on for NEET?",
        "How long does it take to become a doctor?",
        "What medical specialties are in high demand?",
        "How do I prepare for medical entrance exams?"
      ],
      teacher: [
        "What subjects can I teach with my background?",
        "How do I get a B.Ed degree?",
        "What's the difference between government and private teaching jobs?",
        "How do I develop good teaching skills?"
      ],
      artist: [
        "How do I create an impressive art portfolio?",
        "What career opportunities exist in creative fields?",
        "Should I pursue fine arts or commercial art?",
        "How do I monetize my artistic talents?"
      ],
      business: [
        "What should I study to become an entrepreneur?",
        "How do I get into a good MBA program?",
        "What business skills are most important?",
        "How do I start my own business while studying?"
      ]
    };

    const contextualSuggestions = baseSuggestions[mentorType] || baseSuggestions.engineer;

    // Add context-specific suggestions based on user's stream and level
    const streamSpecific = this.getStreamSpecificSuggestions(userContext.recommendedStream, userContext.classLevel);

    return [...contextualSuggestions.slice(0, 2), ...streamSpecific.slice(0, 2)];
  }

  getStreamSpecificSuggestions(stream, classLevel) {
    const suggestions = {
      science: {
        '10': ["Should I choose PCM or PCB for Class 11?", "What are the career options in science?"],
        '12': ["Which entrance exams should I prepare for?", "What are the best science colleges in India?"],
        'UG': ["Should I pursue higher studies or get a job?", "How do I get into research?"],
        'PG': ["What are the PhD opportunities in my field?", "How do I transition to industry?"]
      },
      commerce: {
        '10': ["What subjects should I take in commerce stream?", "Is commerce right for me?"],
        '12': ["Should I pursue CA, CS, or regular graduation?", "What are the job prospects in commerce?"],
        'UG': ["How important is an MBA for my career?", "What are the best commerce career paths?"],
        'PG': ["How do I get into management consulting?", "What are the startup opportunities?"]
      },
      arts: {
        '10': ["What subjects are available in arts stream?", "Can I get good jobs with arts background?"],
        '12': ["What graduation options do I have in arts?", "How do I prepare for competitive exams?"],
        'UG': ["Should I pursue civil services or private jobs?", "What are the creative career options?"],
        'PG': ["How do I get into academia or research?", "What are the government job opportunities?"]
      }
    };

    return suggestions[stream]?.[classLevel] || suggestions.science['12'];
  }

  identifyTopic(userMessage) {
    const topics = {
      career: ['career', 'job', 'profession', 'work', 'future'],
      education: ['college', 'university', 'course', 'study', 'degree', 'graduation'],
      skills: ['skills', 'learn', 'develop', 'improve', 'training'],
      guidance: ['confused', 'help', 'advice', 'guidance', 'suggest', 'recommend'],
      preparation: ['prepare', 'exam', 'entrance', 'test', 'competition']
    };

    const lowerMessage = userMessage.toLowerCase();

    for (const [topic, keywords] of Object.entries(topics)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return topic;
      }
    }

    return 'general';
  }

  generateFallbackResponse(mentor, emotionalState, userContext) {
    const fallbackResponses = {
      neutral: `Hello! I'm ${mentor.name}, and I'm here to help you with your career journey. What would you like to know about ${userContext.recommendedStream || 'your career options'}?`,
      stressed: `I understand you might be feeling overwhelmed right now. That's completely normal! I'm ${mentor.name}, and I'm here to help you navigate this step by step. What's your biggest concern about your future?`,
      excited: `I love your enthusiasm! I'm ${mentor.name}, and I'm thrilled to help you explore your career potential. What aspects of ${userContext.recommendedStream || 'your future career'} are you most excited about?`,
      confused: `It's perfectly okay to feel uncertain about your future - that's why I'm here! I'm ${mentor.name}, and my job is to help clear up the confusion. What specific area would you like to understand better?`
    };

    const fallbackText = fallbackResponses[emotionalState] || fallbackResponses.neutral;

    return {
      success: true,
      text: fallbackText,
      emotion: 'encouraging',
      mentorName: mentor.name,
      mentorTitle: mentor.title,
      suggestions: this.generateContextualSuggestions('general guidance', 'engineer', userContext),
      responseData: {
        userEmotion: emotionalState,
        mentorTone: 'supportive',
        expertise: mentor.expertise,
        conversationTopic: 'introduction'
      }
    };
  }

  // Method to get mentor personality info (for frontend)
  getMentorInfo(mentorType) {
    return this.mentorPersonalities[mentorType] || this.mentorPersonalities.engineer;
  }

  // Method to get all available mentor types
  getAvailableMentors() {
    return Object.keys(this.mentorPersonalities).map(type => ({
      type,
      ...this.mentorPersonalities[type]
    }));
  }
}

export default new MentorAI();