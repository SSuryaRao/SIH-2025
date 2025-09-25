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
        <div className="mentor-selection mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Choose Your Mentor</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {availableMentors.map((mentor) => (
                <motion.button
                  key={mentor.type}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleMentorChange(mentor.type)}
                  className={`p-4 rounded-2xl border-2 transition-all text-center shadow-md hover:shadow-lg ${
                    mentorType === mentor.type
                      ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-800 shadow-blue-200'
                      : 'border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:border-blue-300 hover:shadow-blue-100'
                  }`}
                >
                  <div className="text-3xl mb-2">
                    {mentor.type === 'engineer' && '👨‍💻'}
                    {mentor.type === 'doctor' && '👩‍⚕️'}
                    {mentor.type === 'teacher' && '👨‍🏫'}
                    {mentor.type === 'artist' && '👩‍🎨'}
                    {mentor.type === 'business' && '👨‍💼'}
                  </div>
                  <div className="text-sm font-bold text-gray-800">{mentor.name}</div>
                  <div className="text-xs text-gray-500 font-medium mt-1">{mentor.title.split(' ')[0]}</div>
                  {mentorType === mentor.type && (
                    <div className="mt-2">
                      <div className="inline-flex items-center px-2 py-1 rounded-full bg-blue-500 text-white text-xs font-semibold">
                        ✓ Selected
                      </div>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Avatar Section */}
        <div className="avatar-section">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Mentor Info Header */}
            {mentorInfo && (
              <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                    {mentorType === 'engineer' && '👨‍💻'}
                    {mentorType === 'doctor' && '👩‍⚕️'}
                    {mentorType === 'teacher' && '👨‍🏫'}
                    {mentorType === 'artist' && '👩‍🎨'}
                    {mentorType === 'business' && '👨‍💼'}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl">{mentorInfo.name}</h3>
                    <p className="text-blue-100 font-medium">{mentorInfo.title}</p>
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
            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
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
          <div className="bg-white rounded-2xl shadow-xl h-full flex flex-col border border-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <h3 className="text-lg font-bold text-gray-800">Conversation</h3>
              </div>
              <button
                onClick={startNewConversation}
                className="text-sm bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-md"
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
              className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50/50 to-white custom-scrollbar"
              style={{ maxHeight: '450px' }}
            >
              {conversation.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-3xl mb-6 mx-auto shadow-lg">
                    🤖
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-3">
                    Hi! I&apos;m {mentorInfo?.name || 'your mentor'}
                  </h4>
                  <p className="text-gray-600 mb-4 max-w-sm mx-auto">
                    Ready to guide you through your career journey. Click the microphone to start our conversation!
                  </p>
                  {mentorInfo && (
                    <div className="inline-flex items-center bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
                      <span className="text-sm font-medium text-blue-800">
                        💡 Expertise: {mentorInfo.expertise?.join(', ')}
                      </span>
                    </div>
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
                        className={`max-w-sm px-5 py-3 rounded-2xl shadow-md ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                            : message.isError
                            ? 'bg-red-50 text-red-800 border border-red-200'
                            : 'bg-white text-gray-800 border border-gray-200 shadow-lg'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        {message.mentorName && (
                          <p className="text-xs opacity-75 mt-2 font-medium">
                            — {message.mentorName}
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