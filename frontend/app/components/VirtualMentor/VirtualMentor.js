'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar2D from './Avatar2D';
import VoiceInterface from './VoiceInterface';
import ErrorBoundary from './ErrorBoundary';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function VirtualMentor({
  mentorType = 'engineer',
  onMentorTypeChange,
  className = '',
  showMentorSelection = true
}) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState('neutral');
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mentorInfo, setMentorInfo] = useState(null);
  const [availableMentors, setAvailableMentors] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const conversationRef = useRef(null);

  useEffect(() => {
    checkAuth();
    fetchAvailableMentors();
    fetchMentorInfo(mentorType);
  }, [mentorType]);

  useEffect(() => {
    fetchMentorInfo(mentorType);
  }, [mentorType]);

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      return;
    }
    setIsAuthenticated(true);
  };

  const scrollToBottom = () => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  };

  const fetchAvailableMentors = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/mentor/types`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAvailableMentors(data.mentors);
      }
    } catch (error) {
      console.error('Error fetching mentors:', error);
    }
  };

  const fetchMentorInfo = async (type) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/api/mentor/info/${type}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMentorInfo(data.mentor);
      }
    } catch (error) {
      console.error('Error fetching mentor info:', error);
    }
  };

  const handleUserSpeech = async (speechText) => {
    if (!speechText.trim() || isLoading) return;

    // Add user message to conversation
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: speechText,
      timestamp: new Date().toISOString()
    };

    setConversation(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/mentor/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: speechText,
          mentorType: mentorType,
          conversationId: conversationId,
          emotionalState: detectUserEmotion(speechText)
        })
      });

      if (response.ok) {
        const data = await response.json();

        // Add mentor response to conversation
        const mentorMessage = {
          id: Date.now() + 1,
          role: 'mentor',
          content: data.message,
          emotion: data.mentor.emotion,
          mentorName: data.mentor.name,
          timestamp: data.timestamp,
          suggestions: data.suggestions
        };

        setConversation(prev => [...prev, mentorMessage]);
        setCurrentEmotion(data.mentor.emotion);
        setSuggestions(data.suggestions || []);

        // Update conversation ID if it's a new conversation
        if (!conversationId) {
          setConversationId(data.conversationId);
        }

        // Speak the response
        if (window.mentorSpeak) {
          window.mentorSpeak(data.message, data.mentor.emotion);
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get mentor response');
      }
    } catch (error) {
      console.error('Error in mentor conversation:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'mentor',
        content: 'I apologize, but I encountered an error. Please try speaking to me again.',
        emotion: 'concerned',
        timestamp: new Date().toISOString(),
        isError: true
      };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const detectUserEmotion = (text) => {
    const emotionKeywords = {
      stressed: ['stressed', 'overwhelmed', 'confused', 'worried', 'anxious'],
      excited: ['excited', 'amazing', 'love', 'passionate', 'thrilled'],
      confused: ['confused', 'don&apos;t understand', 'unclear', 'lost'],
      sad: ['sad', 'disappointed', 'upset', 'down']
    };

    const lowerText = text.toLowerCase();

    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return emotion;
      }
    }

    return 'neutral';
  };

  const handleMentorSpeak = () => {
    // This will be called when mentor starts speaking
  };

  const startNewConversation = () => {
    setConversation([]);
    setConversationId(null);
    setCurrentEmotion('neutral');
    setSuggestions([]);
  };

  const handleSuggestionClick = (suggestion) => {
    handleUserSpeech(suggestion);
  };

  const handleMentorChange = (newMentorType) => {
    if (onMentorTypeChange) {
      onMentorTypeChange(newMentorType);
    }
    startNewConversation();
    setCurrentEmotion('neutral');
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-xl">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to access your virtual mentor</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`virtual-mentor-container ${className}`}>
      {/* Mentor Selection */}
      {showMentorSelection && availableMentors.length > 0 && (
        <div className="mentor-selection mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Choose Your Mentor</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {availableMentors.map((mentor) => (
              <motion.button
                key={mentor.type}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleMentorChange(mentor.type)}
                className={`p-3 rounded-xl border-2 transition-all text-center ${
                  mentorType === mentor.type
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">
                  {mentor.type === 'engineer' && '👨‍💻'}
                  {mentor.type === 'doctor' && '👩‍⚕️'}
                  {mentor.type === 'teacher' && '👨‍🏫'}
                  {mentor.type === 'artist' && '👩‍🎨'}
                  {mentor.type === 'business' && '👨‍💼'}
                </div>
                <div className="text-xs font-medium">{mentor.name}</div>
                <div className="text-xs text-gray-600">{mentor.title.split(' ')[0]}</div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* 3D Avatar Section */}
        <div className="avatar-section">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Mentor Info Header */}
            {mentorInfo && (
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl">
                    {mentorType === 'engineer' && '👨‍💻'}
                    {mentorType === 'doctor' && '👩‍⚕️'}
                    {mentorType === 'teacher' && '👨‍🏫'}
                    {mentorType === 'artist' && '👩‍🎨'}
                    {mentorType === 'business' && '👨‍💼'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{mentorInfo.name}</h3>
                    <p className="text-sm opacity-90">{mentorInfo.title}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 2D Avatar */}
            <ErrorBoundary>
              <Avatar2D
                mentorType={mentorType}
                isListening={isListening}
                isSpeaking={isSpeaking}
                emotion={currentEmotion}
                className="h-96"
              />
            </ErrorBoundary>

            {/* Voice Interface */}
            <div className="p-4 border-t">
              <VoiceInterface
                onUserSpeech={handleUserSpeech}
                onMentorSpeak={handleMentorSpeak}
                onListeningChange={setIsListening}
                onSpeakingChange={setIsSpeaking}
                mentorType={mentorType}
              />
            </div>
          </div>
        </div>

        {/* Conversation Section */}
        <div className="conversation-section">
          <div className="bg-white rounded-xl shadow-lg h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-gray-800">Conversation</h3>
              <button
                onClick={startNewConversation}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                </svg>
                <span>New Chat</span>
              </button>
            </div>

            {/* Messages */}
            <div
              ref={conversationRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
              style={{ maxHeight: '400px' }}
            >
              {conversation.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🤖</div>
                  <p className="text-gray-600 mb-4">
                    Hi! I&apos;m {mentorInfo?.name || 'your mentor'}.
                    Click the microphone to start our conversation!
                  </p>
                  {mentorInfo && (
                    <p className="text-sm text-gray-500">
                      Expertise: {mentorInfo.expertise?.join(', ')}
                    </p>
                  )}
                </div>
              ) : (
                <AnimatePresence>
                  {conversation.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-3 rounded-2xl ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : message.isError
                            ? 'bg-red-50 text-red-800 border border-red-200'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        {message.mentorName && (
                          <p className="text-xs opacity-75 mt-1">
                            - {message.mentorName}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-gray-600">Mentor is thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-4 border-t bg-gray-50">
                <p className="text-xs text-gray-600 mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.slice(0, 3).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs bg-white text-blue-600 border border-blue-200 px-3 py-1 rounded-full hover:bg-blue-50 transition-colors"
                    >
                      {suggestion.length > 40 ? suggestion.substring(0, 40) + '...' : suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}