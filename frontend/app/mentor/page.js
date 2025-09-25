'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import VirtualMentor from '../components/VirtualMentor/VirtualMentor';
import './mentor.css';

export default function MentorPage() {
  const [currentMentor, setCurrentMentor] = useState('engineer');
  const [userContext, setUserContext] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    try {
      // Fetch user context and get recommended mentor
      const response = await fetch(`${API_BASE_URL}/api/mentor/recommend`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentMentor(data.recommendedMentor.type);
        setUserContext(data);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error fetching mentor recommendation:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleMentorChange = (newMentorType) => {
    setCurrentMentor(newMentorType);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your mentor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="text-6xl mb-6"
          >
            🔒
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Authentication Required
          </h1>
          <p className="text-gray-600 mb-6">
            Please log in to access your personalized virtual career mentor.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/login'}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Login to Continue
            </button>
            <button
              onClick={() => window.location.href = '/register'}
              className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Virtual Career Mentor
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Meet your AI-powered career counselor! Get personalized guidance with voice conversations,
            3D interactions, and expert advice tailored to your academic journey.
          </p>
        </motion.div>

        {/* Recommended Mentor Banner */}
        {userContext?.recommendedMentor && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl p-6 mb-8"
          >
            <div className="flex items-center space-x-4">
              <div className="text-4xl">⭐</div>
              <div>
                <h3 className="text-xl font-semibold">Recommended for You</h3>
                <p className="opacity-90">
                  {userContext.recommendedMentor.reason}
                </p>
                {/* <div className="flex items-center font-semibold space-x-2 mt-2">
                  <span className="text-sm   px-2 py-1 rounded">
                    {Math.round(userContext.recommendedMentor.matchScore * 100)}% Match
                  </span>
                  <span className="text-sm opacity-90">
                    Based on your {userContext.recommendedMentor.type} interests
                  </span>
                </div> */}
              </div>
            </div>
          </motion.div>
        )}

        {/* Virtual Mentor Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <VirtualMentor
            mentorType={currentMentor}
            onMentorTypeChange={handleMentorChange}
            showMentorSelection={true}
            className="mb-8"
          />
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-4">🎤</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Voice Conversations
            </h3>
            <p className="text-gray-600 text-sm">
              Talk naturally with your mentor using advanced speech recognition and synthesis technology.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-4">🤖</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              3D Avatar Interaction
            </h3>
            <p className="text-gray-600 text-sm">
              Experience lifelike interactions with animated 3D mentors that respond to emotions and context.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Personalized Guidance
            </h3>
            <p className="text-gray-600 text-sm">
              Get advice tailored to your academic stream, interests, and career aspirations.
            </p>
          </div>
        </motion.div>

        {/* Alternative Mentors */}
        {userContext?.alternatives && userContext.alternatives.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="bg-white rounded-xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Other Mentors You Might Like
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {userContext.alternatives.map((mentor, index) => (
                <div
                  key={mentor.type}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="text-3xl">
                    {mentor.type === 'engineer' && '👨‍💻'}
                    {mentor.type === 'doctor' && '👩‍⚕️'}
                    {mentor.type === 'teacher' && '👨‍🏫'}
                    {mentor.type === 'artist' && '👩‍🎨'}
                    {mentor.type === 'business' && '👨‍💼'}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{mentor.name}</h4>
                    <p className="text-sm text-gray-600">{mentor.title}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${mentor.matchScore * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {Math.round(mentor.matchScore * 100)}%
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleMentorChange(mentor.type)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    Switch
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-xl p-6 mt-8"
        >
          <h3 className="text-xl font-semibold mb-4">💡 Tips for Better Conversations</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">🎯 Be Specific</h4>
              <p className="text-sm opacity-90">
                Ask detailed questions about your interests, concerns, or career goals for more personalized advice.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">🎤 Speak Clearly</h4>
              <p className="text-sm opacity-90">
                Use a quiet environment and speak clearly for the best voice recognition experience.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">💭 Express Feelings</h4>
              <p className="text-sm opacity-90">
                Don&apos;t hesitate to share your emotions - mentors adapt their responses to support you better.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">🔄 Try Different Mentors</h4>
              <p className="text-sm opacity-90">
                Each mentor has unique expertise. Switch between them to get diverse perspectives.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}