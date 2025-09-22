'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Building2,
  CalendarDays,
  MapPin,
  User,
  CheckCircle,
  AlertCircle,
  Heart,
  ChevronRight
} from 'lucide-react';

export default function RecommendationsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    fetchRecommendations();
  }, [mounted]);

  const fetchRecommendations = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Check for JWT token in localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        // Redirect to login if no token found
        router.push('/login');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await fetch(apiUrl + '/api/recommendations', {
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendations(data);
        setUser({ username: data.username || 'User' }); // Basic user info from recommendations
      } else if (response.status === 401) {
        // Token is invalid, redirect to login
        localStorage.removeItem('token');
        router.push('/login');
        return;
      } else if (response.status === 404) {
        setError('No recommendations found. Please complete your profile and take the quiz first.');
      } else {
        setError('Failed to fetch recommendations');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Prevent hydration mismatch
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-lg font-medium text-gray-700">Loading personalized recommendations...</div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto p-6"
        >
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  // Show message if no recommendations (quiz not taken)
  if (recommendations?.message) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Heart className="w-20 h-20 text-indigo-600 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Ready to Discover Your Path?</h1>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              {recommendations.message}
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                onClick={() => router.push('/quiz')}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <GraduationCap className="w-6 h-6" />
                Take Career Quiz
                <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            🎯 Your Personalized Recommendations
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Tailored courses, colleges, and opportunities based on your quiz results and preferences.
          </p>
        </motion.div>

        {/* Recommended Stream */}
        {recommendations?.recommendedStream && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-8"
          >
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Recommended Stream</h2>
              <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xl font-bold shadow-lg ${
                recommendations.recommendedStream === 'science' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' :
                recommendations.recommendedStream === 'arts' ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white' :
                recommendations.recommendedStream === 'commerce' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' :
                'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
              }`}>
                <GraduationCap className="w-6 h-6" />
                {recommendations.recommendedStream.charAt(0).toUpperCase() + recommendations.recommendedStream.slice(1)}
              </div>
            </div>
          </motion.div>
        )}

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Recommended Courses */}
          {recommendations?.courses && recommendations.courses.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">📚 Recommended Courses</h3>
              </div>
              <div className="space-y-4">
                {recommendations.courses.slice(0, 5).map((course, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="bg-blue-50 rounded-lg p-4 border border-blue-100"
                  >
                    <h4 className="font-semibold text-gray-900 mb-2">{course.course}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Careers:</strong> {course.careers.slice(0, 3).join(', ')}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Higher Studies:</strong> {course.higherStudies.slice(0, 2).join(', ')}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Recommended Colleges */}
          {recommendations?.colleges && recommendations.colleges.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">🏫 Recommended Colleges</h3>
              </div>
              <div className="space-y-4">
                {recommendations.colleges.slice(0, 5).map((college, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="bg-green-50 rounded-lg p-4 border border-green-100"
                  >
                    <h4 className="font-semibold text-gray-900 mb-2">{college.name}</h4>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4" />
                      {college.location}
                    </div>
                    <p className="text-sm text-gray-600">
                      <strong>Courses:</strong> {college.courses.slice(0, 3).join(', ')}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Upcoming Events */}
          {recommendations?.events && recommendations.events.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg">
                  <CalendarDays className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">📅 Upcoming Events</h3>
              </div>
              <div className="space-y-4">
                {recommendations.events.slice(0, 5).map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="bg-orange-50 rounded-lg p-4 border border-orange-100"
                  >
                    <h4 className="font-semibold text-gray-900 mb-2">{event.title}</h4>
                    <p className="text-sm text-gray-600">
                      📅 {new Date(event.date).toLocaleDateString()}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Career Suggestions */}
        {recommendations?.careers && recommendations.careers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">💼 Career Opportunities</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recommendations.careers.map((career, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className="bg-purple-50 rounded-lg p-4 text-center border border-purple-100"
                >
                  <div className="font-medium text-purple-900">{career}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}