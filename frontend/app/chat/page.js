'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [userContext, setUserContext] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    setIsAuthenticated(true);
    fetchUserContext();
    fetchConversations();
    fetchSuggestions();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchUserContext = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/chat/context`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserContext(data.context);
      }
    } catch (error) {
      console.error('Error fetching user context:', error);
    }
  };

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/chat/conversations`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchSuggestions = async (category = 'general') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/chat/suggestions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ category })
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const loadConversation = async (conversationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/chat/history/${conversationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
        setCurrentConversationId(conversationId);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const sendMessage = async (messageText = null) => {
    const message = messageText || inputMessage.trim();
    if (!message || isLoading) return;

    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
      id: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: message,
          conversationId: currentConversationId
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage = {
          role: 'assistant',
          content: data.response,
          timestamp: data.timestamp,
          id: Date.now() + 1
        };

        setMessages(prev => [...prev, aiMessage]);

        // Update conversation ID if it's a new conversation
        if (!currentConversationId) {
          setCurrentConversationId(data.conversationId);
          fetchConversations(); // Refresh conversations list
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your message. Please try again.',
        timestamp: new Date().toISOString(),
        id: Date.now() + 1,
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewConversation = () => {
    setMessages([]);
    setCurrentConversationId(null);
  };

  const deleteConversation = async (conversationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/chat/conversations/${conversationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchConversations();
        if (currentConversationId === conversationId) {
          startNewConversation();
        }
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 flex flex-col shadow-lg">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                CareerGuide AI
              </h1>
              <p className="text-xs text-gray-600 mt-1">Your AI Career Counselor</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startNewConversation}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
            >
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                </svg>
                <span>New Chat</span>
              </div>
            </motion.button>
          </div>
          {userContext && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl border border-blue-200"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {userContext.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-800">
                    {userContext.username}
                  </p>
                  <p className="text-xs text-blue-600">
                    {userContext.recommendedStream} • Class {userContext.classLevel}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-600 mb-3">Recent Conversations</h3>
            <div className="space-y-2">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`p-3 rounded-lg cursor-pointer border transition-colors ${
                    currentConversationId === conv.id
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                  onClick={() => loadConversation(conv.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {conv.title}
                      </p>
                      <p className="text-xs text-gray-600 truncate mt-1">
                        {conv.lastMessage}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(conv.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(conv.id);
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        {suggestions.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Quick Questions</h4>
            <div className="space-y-1">
              {suggestions.slice(0, 3).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(suggestion)}
                  className="w-full text-left p-2 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="text-center mt-20">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="text-8xl mb-6"
              >
                🤖
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4"
              >
                Welcome to CareerGuide AI!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg leading-relaxed"
              >
                I'm your personal AI career counselor, here to provide tailored guidance based on your unique profile, interests, and aspirations.
                Whether you need help with course selection, college recommendations, or career planning, I'm here to help you succeed!
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 max-w-3xl mx-auto mb-8"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-3">✨ What I can help you with:</h3>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <span className="text-blue-500">📚</span>
                    <span>Course recommendations & selection</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <span className="text-green-500">🏫</span>
                    <span>College guidance & admissions</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <span className="text-purple-500">💼</span>
                    <span>Career planning & opportunities</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <span className="text-orange-500">🎯</span>
                    <span>Study plans & skill development</span>
                  </div>
                </div>
              </motion.div>
              {suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-gray-600 mb-4 font-medium">🚀 Get started with these popular questions:</p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {suggestions.slice(0, 4).map((suggestion, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => sendMessage(suggestion)}
                        className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-2 border-blue-200 px-6 py-3 rounded-xl text-sm font-medium hover:from-blue-200 hover:to-indigo-200 hover:border-blue-300 transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        {suggestion.length > 60 ? suggestion.substring(0, 60) + '...' : suggestion}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-3xl px-6 py-4 rounded-2xl shadow-lg border-2 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-200'
                          : message.isError
                          ? 'bg-red-50 text-red-800 border-red-200'
                          : 'bg-white text-gray-800 border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-200'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      <div
                        className={`text-xs mt-2 ${
                          message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}
                      >
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-2 border-blue-100 shadow-lg px-6 py-4 rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-700 font-medium">CareerGuide AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border-2 border-blue-100 p-4">
              <div className="flex items-end space-x-4">
                <div className="flex-1 relative">
                  <div className="absolute left-4 top-3 text-blue-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg>
                  </div>
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me about courses, colleges, career guidance, or anything related to your education..."
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-400 resize-none text-gray-800 placeholder-gray-500 text-base transition-all duration-200 hover:border-blue-300"
                    rows="1"
                    style={{
                      minHeight: '56px',
                      maxHeight: '120px',
                      fontSize: '16px',
                      lineHeight: '1.5'
                    }}
                  />
                  {/* Character count indicator */}
                  {inputMessage.length > 0 && (
                    <div className="absolute right-3 bottom-2 text-xs text-gray-400">
                      {inputMessage.length}/500
                    </div>
                  )}
                </div>

                {/* Enhanced Send Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => sendMessage()}
                  disabled={isLoading || !inputMessage.trim()}
                  className={`relative px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform shadow-lg ${
                    isLoading || !inputMessage.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:-translate-y-0.5'
                  }`}
                  style={{ minHeight: '56px', minWidth: '120px' }}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Send</span>
                      <svg className="w-5 h-5 transform rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                      </svg>
                    </div>
                  )}
                </motion.button>
              </div>

              {/* Enhanced help text */}
              <div className="flex items-center justify-between mt-3 px-2">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span className="flex items-center space-x-1">
                    <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">Enter</kbd>
                    <span>to send</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs font-mono">Shift + Enter</kbd>
                    <span>for new line</span>
                  </span>
                </div>
                {inputMessage.trim() && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-xs text-blue-600 font-medium"
                  >
                    Ready to send!
                  </motion.div>
                )}
              </div>
            </div>

            {/* Quick action buttons */}
            {suggestions.length > 0 && messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4"
              >
                <p className="text-sm text-gray-600 mb-3 text-center">Or try these quick questions:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestions.slice(0, 3).map((suggestion, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => sendMessage(suggestion)}
                      className="bg-white text-blue-700 border-2 border-blue-200 px-4 py-2 rounded-xl text-sm hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      {suggestion.length > 50 ? suggestion.substring(0, 50) + '...' : suggestion}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}