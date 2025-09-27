'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  BarChart3,
  GraduationCap,
  Building2,
  Calendar,
  ShieldCheck,
  Target,
  MapPin,
  Clock,
  Award,
  TrendingUp,
  Zap,
  Heart,
  Star,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  UserCircle
} from 'lucide-react';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState('');
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', type: 'admission' });
  const [editingEvent, setEditingEvent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ course: '', careers: '', higherStudies: '' });
  const [editingCourse, setEditingCourse] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [newCollege, setNewCollege] = useState({ name: '', location: '', latitude: '', longitude: '', courses: '', facilities: '' });
  const [editingCollege, setEditingCollege] = useState(null);
  const [activeTab, setActiveTab] = useState('timeline');
  const [recommendations, setRecommendations] = useState(null);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);


  const fetchProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please log in again.');
        router.push('/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setError(''); // Clear any previous errors
      } else if (response.status === 401) {
        setError('Session expired. Please log in again.');
        localStorage.removeItem('token');
        router.push('/login');
      } else {
        setError('Failed to load profile data. Please try again.');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setProfileLoading(false);
    }
  }, [router]);


  const checkAuthentication = useCallback(async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem('token');
        router.push('/login');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
      localStorage.removeItem('token');
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const fetchTimelineEvents = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/timeline`);
      if (response.ok) {
        const events = await response.json();
        setTimelineEvents(events);
      }
    } catch (err) {
      console.error('Error fetching timeline events:', err);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/courses`);
      if (response.ok) {
        const coursesData = await response.json();
        setCourses(coursesData);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const fetchColleges = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/colleges`);
      if (response.ok) {
        const collegesData = await response.json();
        setColleges(collegesData);
      }
    } catch (err) {
      console.error('Error fetching colleges:', err);
    }
  };

  const fetchRecommendations = useCallback(async () => {
    setRecommendationsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required for recommendations.');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/recommendations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const recommendationsData = await response.json();
        setRecommendations(recommendationsData);
      } else if (response.status === 401) {
        setError('Session expired. Please log in again.');
        localStorage.removeItem('token');
        router.push('/login');
      } else if (response.status === 404) {
        setError('Recommendations not found. Please complete your profile and take the quiz.');
      } else {
        setError('Failed to load recommendations. Please try again.');
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Network error while loading recommendations. Please check your connection.');
    } finally {
      setRecommendationsLoading(false);
    }
  }, [router]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/admin/timeline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        setNewEvent({ title: '', date: '', type: 'admission' });
        fetchTimelineEvents();
      }
    } catch (err) {
      console.error('Error creating event:', err);
    }
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/admin/timeline/${editingEvent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editingEvent.title,
          date: editingEvent.date,
          type: editingEvent.type,
        }),
      });

      if (response.ok) {
        setEditingEvent(null);
        fetchTimelineEvents();
      }
    } catch (err) {
      console.error('Error updating event:', err);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/admin/timeline/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchTimelineEvents();
      }
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/admin/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          course: newCourse.course,
          careers: newCourse.careers.split(',').map(c => c.trim()),
          higherStudies: newCourse.higherStudies.split(',').map(h => h.trim()),
        }),
      });

      if (response.ok) {
        setNewCourse({ course: '', careers: '', higherStudies: '' });
        fetchCourses();
      }
    } catch (err) {
      console.error('Error creating course:', err);
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/admin/courses/${editingCourse.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          course: editingCourse.course,
          careers: editingCourse.careers.split(',').map(c => c.trim()),
          higherStudies: editingCourse.higherStudies.split(',').map(h => h.trim()),
        }),
      });

      if (response.ok) {
        setEditingCourse(null);
        fetchCourses();
      }
    } catch (err) {
      console.error('Error updating course:', err);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/admin/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchCourses();
      }
    } catch (err) {
      console.error('Error deleting course:', err);
    }
  };

  const handleCreateCollege = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/admin/colleges`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newCollege.name,
          location: newCollege.location,
          latitude: parseFloat(newCollege.latitude),
          longitude: parseFloat(newCollege.longitude),
          courses: newCollege.courses.split(',').map(c => c.trim()),
          facilities: newCollege.facilities.split(',').map(f => f.trim()),
        }),
      });

      if (response.ok) {
        setNewCollege({ name: '', location: '', latitude: '', longitude: '', courses: '', facilities: '' });
        fetchColleges();
      }
    } catch (err) {
      console.error('Error creating college:', err);
    }
  };

  const handleUpdateCollege = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/admin/colleges/${editingCollege.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editingCollege.name,
          location: editingCollege.location,
          latitude: parseFloat(editingCollege.latitude),
          longitude: parseFloat(editingCollege.longitude),
          courses: editingCollege.courses.split(',').map(c => c.trim()),
          facilities: editingCollege.facilities.split(',').map(f => f.trim()),
        }),
      });

      if (response.ok) {
        setEditingCollege(null);
        fetchColleges();
      }
    } catch (err) {
      console.error('Error updating college:', err);
    }
  };

  const handleDeleteCollege = async (collegeId) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/admin/colleges/${collegeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchColleges();
      }
    } catch (err) {
      console.error('Error deleting college:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  // useEffect to initialize authentication and profile fetching
  useEffect(() => {
    if (!mounted) return;
    checkAuthentication();
    fetchProfile();
  }, [mounted, checkAuthentication, fetchProfile]);

  // useEffect to fetch admin data and recommendations
  useEffect(() => {
    if (user?.role === 'admin') {
      fetchTimelineEvents();
      fetchCourses();
      fetchColleges();
    }
    if (user) {
      fetchRecommendations();
    }
  }, [user, fetchRecommendations]);

  // Prevent hydration mismatch
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-['Inter',sans-serif]">
      {/* Hero Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white"
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-2">
              Welcome back, {user?.username}! 👋
            </h1>
            <p className="text-blue-100 text-lg md:text-xl font-medium">
              Ready to explore your personalized learning journey?
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-4 flex items-center gap-2"
            >
              <Star className="w-5 h-5 text-yellow-300" />
              <span className="text-blue-100">Your success story starts here</span>
            </motion.div>
          </motion.div>

          {/* Role Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="absolute top-4 right-4"
          >
            <div className={`px-4 py-2 rounded-full font-semibold text-sm ${
              user?.role === 'admin'
                ? 'bg-red-500/20 text-red-100 border border-red-400/30'
                : 'bg-blue-500/20 text-blue-100 border border-blue-400/30'
            }`}>
              {user?.role === 'admin' ? (
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Admin
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Student
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 -mt-8 relative z-10">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Avatar */}
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
              <UserCircle className="w-10 h-10 text-white" />
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left">
              {profileLoading ? (
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-32 mb-2 mx-auto sm:mx-0"></div>
                  <div className="h-4 bg-gray-200 rounded w-24 mx-auto sm:mx-0"></div>
                </div>
              ) : profile ? (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {profile.username}
                  </h2>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      profile.classLevel === '10' || profile.classLevel === '12'
                        ? 'bg-blue-100 text-blue-800'
                        : profile.classLevel === 'UG'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {profile.classLevel === '10' && 'Class 10 Student'}
                      {profile.classLevel === '12' && 'Class 12 Student'}
                      {profile.classLevel === 'UG' && 'Undergraduate Student'}
                      {profile.classLevel === 'PG' && 'Postgraduate Student'}
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-gray-500">
                  <p className="text-lg font-medium">Profile not available</p>
                </div>
              )}
            </div>

            {/* Edit Profile Link */}
            <Link
              href="/profile"
              className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors duration-200 font-medium"
            >
              Edit Profile
            </Link>
          </div>
        </motion.div>

        {/* Quiz Results Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl text-gray-900 font-bold">Quiz Results</h2>
          </div>

          {user?.quizResult?.recommendedStream ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="mb-8">
                <p className="text-gray-600 mb-3 text-lg">Your Recommended Stream:</p>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-lg font-bold shadow-lg ${
                    user.quizResult.recommendedStream === 'science' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' :
                    user.quizResult.recommendedStream === 'arts' ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white' :
                    user.quizResult.recommendedStream === 'commerce' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' :
                    'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                  }`}
                >
                  <Award className="w-5 h-5" />
                  {user.quizResult.recommendedStream.charAt(0).toUpperCase() + user.quizResult.recommendedStream.slice(1)}
                </motion.div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Stream Compatibility:</h3>
                {user.quizResult.finalScores ?
                  Object.entries(user.quizResult.finalScores).map(([stream, score], index) => {
                    const maxScore = Math.max(...Object.values(user.quizResult.finalScores));
                    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;

                    return (
                      <motion.div
                        key={stream}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                        className="space-y-3"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-gray-800 font-semibold capitalize text-lg">{stream}</span>
                          <span className="text-lg text-gray-900 font-bold bg-gray-100 px-3 py-1 rounded-lg">{Math.round(percentage)}%</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, delay: 0.7 + index * 0.1, ease: "easeOut" }}
                            className={`h-3 rounded-full relative ${
                              stream === 'science' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                              stream === 'arts' ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                              stream === 'commerce' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                              'bg-gradient-to-r from-orange-500 to-orange-600'
                            }`}
                          />
                        </div>
                      </motion.div>
                    );
                  }) :
                  // Fallback to old scores format
                  user.quizResult.scores ? Object.entries(user.quizResult.scores).map(([stream, score], index) => {
                    const maxScore = Math.max(...Object.values(user.quizResult.scores));
                    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
                  return (
                    <motion.div
                      key={stream}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      className="space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-gray-800 font-semibold capitalize text-lg">{stream}</span>
                        <span className="text-lg text-gray-900 font-bold bg-gray-100 px-3 py-1 rounded-lg">{score}</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: 0.7 + index * 0.1, ease: "easeOut" }}
                          className={`h-3 rounded-full relative ${
                            stream === 'science' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                            stream === 'arts' ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                            stream === 'commerce' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                            'bg-gradient-to-r from-orange-500 to-orange-600'
                          }`}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                }) : <p className="text-gray-500">No quiz scores available</p>}

                {/* Aptitude and Personality Scores */}
                {user.quizResult.aptitudeScores && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Aptitude Performance ({Math.round(user.quizResult.aptitudePercentage || 0)}%)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.entries(user.quizResult.aptitudeScores).map(([type, score]) => (
                        <motion.div
                          key={type}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="bg-indigo-50 rounded-lg p-4"
                        >
                          <div className="text-sm font-medium text-indigo-800 capitalize">{type}</div>
                          <div className="text-xl font-bold text-indigo-900">{score}/2</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {user.quizResult.personalityScores && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Personality Traits</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.entries(user.quizResult.personalityScores).map(([trait, score]) => (
                        <motion.div
                          key={trait}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="bg-purple-50 rounded-lg p-4"
                        >
                          <div className="text-sm font-medium text-purple-800 capitalize">{trait}</div>
                          <div className="text-xl font-bold text-purple-900">{score}/5</div>
                          <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full"
                              style={{ width: `${(score / 5) * 100}%` }}
                            ></div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center py-12"
            >
              <div className="p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Target className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Ready to discover your path?</h3>
              <p className="text-gray-600 mb-6 text-lg">Take our personalized quiz to unlock your potential!</p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/quiz"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Zap className="w-5 h-5" />
                  Take the Quiz Now
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* Your Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl text-gray-900 font-bold">Your Recommendations</h2>
          </div>

          {recommendationsLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 mx-auto"></div>
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-purple-600 mx-auto absolute top-0 left-0 right-0"></div>
              </div>
              <p className="text-gray-600 mt-6 text-lg font-medium">Loading personalized recommendations...</p>
            </motion.div>
          ) : recommendations ? (
            recommendations.message ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-12"
              >
                <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Target className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Ready to unlock your potential?</h3>
                <p className="text-gray-600 mb-6 text-lg">{recommendations.message}</p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/quiz"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Heart className="w-5 h-5" />
                    Take the Quiz
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="mb-8">
                  <p className="text-gray-600 mb-3 text-lg">Based on your recommended stream:</p>
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-lg font-bold shadow-lg ${
                      recommendations.recommendedStream === 'science' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' :
                      recommendations.recommendedStream === 'arts' ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white' :
                      recommendations.recommendedStream === 'commerce' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' :
                      'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                    }`}
                  >
                    <TrendingUp className="w-5 h-5" />
                    {recommendations.recommendedStream.charAt(0).toUpperCase() + recommendations.recommendedStream.slice(1)}
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Suggested Courses */}
                  {recommendations.courses && recommendations.courses.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                          <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-bold text-blue-900 text-lg">🎓 Suggested Courses</h3>
                      </div>
                      <div className="space-y-3">
                        {recommendations.courses.slice(0, 3).map((course, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                          >
                            <div className="font-semibold text-gray-900 mb-2">{course.course}</div>
                            <div className="text-sm text-gray-600 font-medium">
                              {course.careers.slice(0, 2).join(' • ')}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Suggested Colleges */}
                  {recommendations.colleges && recommendations.colleges.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
                          <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-bold text-green-900 text-lg">🏫 Suggested Colleges</h3>
                      </div>
                      <div className="space-y-3">
                        {recommendations.colleges.slice(0, 3).map((college, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                          >
                            <div className="font-semibold text-gray-900 mb-2">{college.name}</div>
                            <div className="text-sm text-gray-600 font-medium flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-green-600" />
                              {college.location}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Upcoming Events */}
                  {recommendations.upcomingEvents && recommendations.upcomingEvents.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-bold text-orange-900 text-lg">📅 Upcoming Events</h3>
                      </div>
                      <div className="space-y-3">
                        {recommendations.upcomingEvents.slice(0, 3).map((event, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                          >
                            <div className="font-semibold text-gray-900 mb-2">{event.title}</div>
                            <div className="text-sm text-gray-600 font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3 text-orange-600" />
                              {new Date(event.date).toLocaleDateString()}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Target className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Unlock personalized recommendations</h3>
              <p className="text-gray-600 mb-6 text-lg">Take our quiz to discover tailored courses, colleges, and opportunities!</p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/quiz"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Heart className="w-5 h-5" />
                  Take the Quiz
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* Admin Panel */}
        {user?.role === 'admin' && (
          <motion.div
            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Gradient Mini-Hero Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-6 mb-8 text-white">
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className="w-8 h-8" />
                <h2 className="text-2xl font-bold">⚙️ Admin Control Panel</h2>
              </div>
              <p className="text-indigo-100">Manage Timeline, Courses, and Colleges seamlessly.</p>
            </div>

            {/* Tab Navigation - Rounded Pills with Gradients */}
            <div className="flex flex-wrap gap-3 mb-8 bg-gray-100 p-2 rounded-2xl">
              <motion.button
                onClick={() => setActiveTab('timeline')}
                className={`px-4 py-3 font-medium transition-all duration-300 flex items-center gap-2 rounded-xl ${
                  activeTab === 'timeline'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Calendar className="w-4 h-4" />
                Timeline
              </motion.button>
              <motion.button
                onClick={() => setActiveTab('courses')}
                className={`px-4 py-3 font-medium transition-all duration-300 flex items-center gap-2 rounded-xl ${
                  activeTab === 'courses'
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <GraduationCap className="w-4 h-4" />
                Courses
              </motion.button>
              <motion.button
                onClick={() => setActiveTab('colleges')}
                className={`px-4 py-3 font-medium transition-all duration-300 flex items-center gap-2 rounded-xl ${
                  activeTab === 'colleges'
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Building2 className="w-4 h-4" />
                Colleges
              </motion.button>
            </div>

            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
              <div>
                {/* Add New Event Form */}
                <motion.form
                  onSubmit={handleCreateEvent}
                  className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Add New Timeline Event
                  </h3>
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Event title"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        className="w-full bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <input
                          type="date"
                          value={newEvent.date}
                          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                          className="w-full bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div className="relative">
                        <select
                          value={newEvent.type}
                          onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                          className="w-full bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="admission">📚 Admission</option>
                          <option value="scholarship">💰 Scholarship</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    type="submit"
                    className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Plus className="w-4 h-4" />
                    Add Event
                  </motion.button>
                </motion.form>

                {/* Timeline Events List */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Manage Timeline Events
                  </h3>
                  <div className="space-y-4">
                    {timelineEvents.map((event, index) => (
                      <motion.div
                        key={event.id}
                        className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        {editingEvent?.id === event.id ? (
                          <motion.form
                            onSubmit={handleUpdateEvent}
                            className="space-y-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="relative">
                              <input
                                type="text"
                                value={editingEvent.title}
                                onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                                className="w-full bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="relative">
                                <input
                                  type="date"
                                  value={editingEvent.date}
                                  onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                                  className="w-full bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  required
                                />
                              </div>
                              <div className="relative">
                                <select
                                  value={editingEvent.type}
                                  onChange={(e) => setEditingEvent({ ...editingEvent, type: e.target.value })}
                                  className="w-full bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                  <option value="admission">📚 Admission</option>
                                  <option value="scholarship">💰 Scholarship</option>
                                </select>
                              </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                              <motion.button
                                type="submit"
                                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Save className="w-4 h-4" />
                                Save
                              </motion.button>
                              <motion.button
                                type="button"
                                onClick={() => setEditingEvent(null)}
                                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <X className="w-4 h-4" />
                                Cancel
                              </motion.button>
                            </div>
                          </motion.form>
                        ) : (
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div className="flex-1 mb-4 sm:mb-0">
                              <h4 className="text-lg font-bold text-gray-800 mb-2">{event.title}</h4>
                              <div className="flex flex-wrap items-center gap-3 text-sm">
                                <span className="flex items-center gap-1 text-gray-600">
                                  <Clock className="w-4 h-4" />
                                  {new Date(event.date).toLocaleDateString()}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  event.type === 'admission'
                                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                    : 'bg-green-100 text-green-700 border border-green-200'
                                }`}>
                                  {event.type === 'admission' ? '📚 Admission' : '💰 Scholarship'}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2 ml-0 sm:ml-4 flex-shrink-0">
                              <motion.button
                                onClick={() => setEditingEvent(event)}
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Edit className="w-4 h-4" />
                                <span className="hidden sm:inline">Edit</span>
                              </motion.button>
                              <motion.button
                                onClick={() => handleDeleteEvent(event.id)}
                                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Trash2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Delete</span>
                              </motion.button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Courses Tab */}
            {activeTab === 'courses' && (
              <div>
                {/* Add New Course Form */}
                <motion.form
                  onSubmit={handleCreateCourse}
                  className="mb-8 bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-green-600" />
                    Add New Course
                  </h3>
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Course name (e.g., B.Sc., B.Tech)"
                        value={newCourse.course}
                        onChange={(e) => setNewCourse({ ...newCourse, course: e.target.value })}
                        className="w-full bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Careers (comma-separated: Software Engineer, Data Scientist)"
                        value={newCourse.careers}
                        onChange={(e) => setNewCourse({ ...newCourse, careers: e.target.value })}
                        className="w-full bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Higher studies (comma-separated: M.Sc., MBA)"
                        value={newCourse.higherStudies}
                        onChange={(e) => setNewCourse({ ...newCourse, higherStudies: e.target.value })}
                        className="w-full bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <motion.button
                    type="submit"
                    className="mt-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Plus className="w-4 h-4" />
                    Add Course
                  </motion.button>
                </motion.form>

                {/* Courses List */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-green-600" />
                    Manage Courses
                  </h3>
                  <div className="space-y-4">
                    {courses.map((course, index) => (
                      <motion.div
                        key={course.id}
                        className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        {editingCourse?.id === course.id ? (
                          <motion.form
                            onSubmit={handleUpdateCourse}
                            className="space-y-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="relative">
                              <input
                                type="text"
                                value={editingCourse.course}
                                onChange={(e) => setEditingCourse({ ...editingCourse, course: e.target.value })}
                                className="w-full bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                              />
                            </div>
                            <div className="relative">
                              <input
                                type="text"
                                value={editingCourse.careers}
                                onChange={(e) => setEditingCourse({ ...editingCourse, careers: e.target.value })}
                                className="w-full bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Careers (comma-separated)"
                                required
                              />
                            </div>
                            <div className="relative">
                              <input
                                type="text"
                                value={editingCourse.higherStudies}
                                onChange={(e) => setEditingCourse({ ...editingCourse, higherStudies: e.target.value })}
                                className="w-full bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Higher studies (comma-separated)"
                                required
                              />
                            </div>
                            <div className="flex gap-3 pt-2">
                              <motion.button
                                type="submit"
                                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Save className="w-4 h-4" />
                                Save
                              </motion.button>
                              <motion.button
                                type="button"
                                onClick={() => setEditingCourse(null)}
                                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <X className="w-4 h-4" />
                                Cancel
                              </motion.button>
                            </div>
                          </motion.form>
                        ) : (
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div className="flex-1 mb-4 sm:mb-0">
                              <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                                🎓 {course.course}
                              </h4>
                              <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                  <span className="text-sm font-semibold text-green-600 min-w-[80px]">Careers:</span>
                                  <span className="text-sm text-gray-700 flex-1">{course.careers.join(', ')}</span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <span className="text-sm font-semibold text-blue-600 min-w-[80px]">Studies:</span>
                                  <span className="text-sm text-gray-700 flex-1">{course.higherStudies.join(', ')}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 ml-0 sm:ml-4 flex-shrink-0">
                              <motion.button
                                onClick={() => setEditingCourse({
                                  ...course,
                                  careers: course.careers.join(', '),
                                  higherStudies: course.higherStudies.join(', ')
                                })}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Edit className="w-4 h-4" />
                                <span className="hidden sm:inline">Edit</span>
                              </motion.button>
                              <motion.button
                                onClick={() => handleDeleteCourse(course.id)}
                                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Trash2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Delete</span>
                              </motion.button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Colleges Tab */}
            {activeTab === 'colleges' && (
              <div>
                {/* Add New College Form */}
                <motion.form
                  onSubmit={handleCreateCollege}
                  className="mb-8 bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-2xl border border-purple-100"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-purple-600" />
                    Add New College
                  </h3>
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="College name (e.g., IIT Delhi, Delhi University)"
                        value={newCollege.name}
                        onChange={(e) => setNewCollege({ ...newCollege, name: e.target.value })}
                        className="w-full bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Location (e.g., New Delhi, Delhi)"
                        value={newCollege.location}
                        onChange={(e) => setNewCollege({ ...newCollege, location: e.target.value })}
                        className="w-full bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <input
                          type="number"
                          step="any"
                          placeholder="Latitude (e.g., 28.6139)"
                          value={newCollege.latitude}
                          onChange={(e) => setNewCollege({ ...newCollege, latitude: e.target.value })}
                          className="w-full bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          step="any"
                          placeholder="Longitude (e.g., 77.2090)"
                          value={newCollege.longitude}
                          onChange={(e) => setNewCollege({ ...newCollege, longitude: e.target.value })}
                          className="w-full bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Courses (comma-separated: B.Tech, M.Tech, PhD)"
                        value={newCollege.courses}
                        onChange={(e) => setNewCollege({ ...newCollege, courses: e.target.value })}
                        className="w-full bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Facilities (comma-separated: Hostel, Library, Labs, Sports)"
                        value={newCollege.facilities}
                        onChange={(e) => setNewCollege({ ...newCollege, facilities: e.target.value })}
                        className="w-full bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <motion.button
                    type="submit"
                    className="mt-4 bg-gradient-to-r from-purple-500 to-violet-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Plus className="w-4 h-4" />
                    Add College
                  </motion.button>
                </motion.form>

                {/* Colleges List */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-purple-600" />
                    Manage Colleges
                  </h3>
                  <div className="space-y-4">
                    {colleges.map((college, index) => (
                      <motion.div
                        key={college.id}
                        className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        {editingCollege?.id === college.id ? (
                          <motion.form
                            onSubmit={handleUpdateCollege}
                            className="space-y-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="relative">
                              <input
                                type="text"
                                value={editingCollege.name}
                                onChange={(e) => setEditingCollege({ ...editingCollege, name: e.target.value })}
                                className="w-full bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                              />
                            </div>
                            <div className="relative">
                              <input
                                type="text"
                                value={editingCollege.location}
                                onChange={(e) => setEditingCollege({ ...editingCollege, location: e.target.value })}
                                className="w-full bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="relative">
                                <input
                                  type="number"
                                  step="any"
                                  value={editingCollege.latitude}
                                  onChange={(e) => setEditingCollege({ ...editingCollege, latitude: e.target.value })}
                                  className="w-full bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  required
                                />
                              </div>
                              <div className="relative">
                                <input
                                  type="number"
                                  step="any"
                                  value={editingCollege.longitude}
                                  onChange={(e) => setEditingCollege({ ...editingCollege, longitude: e.target.value })}
                                  className="w-full bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  required
                                />
                              </div>
                            </div>
                            <div className="relative">
                              <input
                                type="text"
                                value={editingCollege.courses}
                                onChange={(e) => setEditingCollege({ ...editingCollege, courses: e.target.value })}
                                className="w-full bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Courses (comma-separated)"
                                required
                              />
                            </div>
                            <div className="relative">
                              <input
                                type="text"
                                value={editingCollege.facilities}
                                onChange={(e) => setEditingCollege({ ...editingCollege, facilities: e.target.value })}
                                className="w-full bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Facilities (comma-separated)"
                                required
                              />
                            </div>
                            <div className="flex gap-3 pt-2">
                              <motion.button
                                type="submit"
                                className="bg-gradient-to-r from-purple-500 to-violet-600 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Save className="w-4 h-4" />
                                Save
                              </motion.button>
                              <motion.button
                                type="button"
                                onClick={() => setEditingCollege(null)}
                                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <X className="w-4 h-4" />
                                Cancel
                              </motion.button>
                            </div>
                          </motion.form>
                        ) : (
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div className="flex-1 mb-4 sm:mb-0">
                              <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                                🏛️ {college.name}
                              </h4>
                              <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                  <span className="text-sm font-semibold text-purple-600 min-w-[90px]">Location:</span>
                                  <span className="text-sm text-gray-700 flex-1">{college.location}</span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <span className="text-sm font-semibold text-indigo-600 min-w-[90px]">Coordinates:</span>
                                  <span className="text-sm text-gray-700 flex-1">{college.latitude}, {college.longitude}</span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <span className="text-sm font-semibold text-green-600 min-w-[90px]">Courses:</span>
                                  <span className="text-sm text-gray-700 flex-1">{college.courses.join(', ')}</span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <span className="text-sm font-semibold text-blue-600 min-w-[90px]">Facilities:</span>
                                  <span className="text-sm text-gray-700 flex-1">{college.facilities.join(', ')}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 ml-0 sm:ml-4 flex-shrink-0">
                              <motion.button
                                onClick={() => setEditingCollege({
                                  ...college,
                                  courses: college.courses.join(', '),
                                  facilities: college.facilities.join(', ')
                                })}
                                className="bg-gradient-to-r from-purple-500 to-violet-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Edit className="w-4 h-4" />
                                <span className="hidden sm:inline">Edit</span>
                              </motion.button>
                              <motion.button
                                onClick={() => handleDeleteCollege(college.id)}
                                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Trash2 className="w-4 h-4" />
                                <span className="hidden sm:inline">Delete</span>
                              </motion.button>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Quick Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl text-gray-900 font-bold">Quick Actions</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/quiz"
                className="group flex flex-col items-center gap-3 bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform"
              >
                <div className="p-3 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <span className="font-semibold text-lg">Take Quiz</span>
                <span className="text-blue-100 text-sm text-center">Discover your potential</span>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/courses"
                className="group flex flex-col items-center gap-3 bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform"
              >
                <div className="p-3 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="font-semibold text-lg">Explore Courses</span>
                <span className="text-green-100 text-sm text-center">Find your path</span>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/colleges"
                className="group flex flex-col items-center gap-3 bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform"
              >
                <div className="p-3 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="font-semibold text-lg">Find Colleges</span>
                <span className="text-purple-100 text-sm text-center">Your future home</span>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/timeline"
                className="group flex flex-col items-center gap-3 bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform"
              >
                <div className="p-3 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                  <Calendar className="w-6 h-6" />
                </div>
                <span className="font-semibold text-lg">View Timeline</span>
                <span className="text-orange-100 text-sm text-center">Important dates</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Logout Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center pb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <User className="w-5 h-5" />
            Logout
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}