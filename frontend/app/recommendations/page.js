'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Building2,
  CalendarDays,
  MapPin,
  Clock,
  Download,
  Target,
  BookOpen,
  Users,
  BookMarked,
  Briefcase
} from 'lucide-react';

export default function RecommendationsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [recommendations, setRecommendations] = useState({
    recommendedStream: '',
    classLevel: '',
    courses: [],
    colleges: [],
    events: [],
    careers: []
  });
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
      // Check for JWT token in localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        // Redirect to login if no token found
        router.push('/login');
        return;
      }

      const response = await fetch('http://localhost:4000/api/recommendations', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendations(data);
      } else if (response.status === 401) {
        // Token is invalid, redirect to login
        localStorage.removeItem('token');
        router.push('/login');
        return;
      } else {
        setError('Failed to fetch recommendations');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  const getEventConfig = (type) => {
    switch (type) {
      case 'admission':
        return {
          color: 'blue',
          bgColor: 'bg-blue-500',
          badgeClass: 'bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium'
        };
      case 'scholarship':
        return {
          color: 'green',
          bgColor: 'bg-green-500',
          badgeClass: 'bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium'
        };
      default:
        return {
          color: 'orange',
          bgColor: 'bg-orange-500',
          badgeClass: 'bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium'
        };
    }
  };

  const generateCalendarLink = (event) => {
    const startDate = new Date(event.date);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

    const formatCalendarDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const calendarData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Digital Guidance Platform//Recommendation Event//EN',
      'BEGIN:VEVENT',
      `DTSTART:${formatCalendarDate(startDate)}`,
      `DTEND:${formatCalendarDate(endDate)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.type} event`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([calendarData], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title.replace(/\s+/g, '_')}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Get dynamic content based on class level
  const getDynamicContent = () => {
    const classLevel = recommendations.classLevel;

    return {
      coursesTitle: {
        '10': '📚 Recommended Streams for Class 11/12',
        '12': '🎓 Recommended Degree Courses',
        'UG': '📖 Recommended Higher Studies',
        'PG': '🎯 Advanced Study Options'
      }[classLevel] || '🎓 Suggested Courses',

      coursesIcon: {
        '10': BookOpen,
        '12': GraduationCap,
        'UG': BookMarked,
        'PG': BookMarked
      }[classLevel] || GraduationCap,

      collegesTitle: {
        '10': '🏫 Suggested Junior Colleges',
        '12': '🏛️ Suggested Degree Colleges',
        'UG': '🎯 Suggested Career Paths',
        'PG': '🏢 Suggested Career Paths'
      }[classLevel] || '🏫 Suggested Colleges',

      eventsTitle: {
        '10': '📅 Upcoming Admission Events',
        '12': '📅 Upcoming Admission Events',
        'UG': '📅 Relevant Entrance Exams & Events',
        'PG': '📅 Relevant Entrance Exams & Events'
      }[classLevel] || '📅 Upcoming Events',

      coursesEmptyMessage: {
        '10': 'Take the quiz to unlock your Class 11 stream recommendations.',
        '12': 'Take the quiz to unlock personalized degree course recommendations.',
        'UG': 'Take the quiz to unlock higher studies recommendations.',
        'PG': 'Take the quiz to unlock advanced study recommendations.'
      }[classLevel] || 'Take the quiz to unlock personalized course recommendations.',

      collegesEmptyMessage: {
        '10': 'Take the quiz to unlock junior college recommendations.',
        '12': 'Take the quiz to unlock degree college recommendations.',
        'UG': 'Take the quiz to unlock career path recommendations.',
        'PG': 'Take the quiz to unlock career path recommendations.'
      }[classLevel] || 'Take the quiz to unlock personalized college recommendations.'
    };
  };

  const dynamicContent = getDynamicContent();

  const CourseCard = ({ course, index }) => {
    const IconComponent = dynamicContent.coursesIcon;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-transparent hover:border-indigo-500"
      >
        <div className="flex items-center mb-4">
          <IconComponent className="w-8 h-8 text-indigo-600 mr-3" />
          <h3 className="text-xl font-bold text-gray-900">{course.course}</h3>
        </div>

      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2 flex items-center">
          <span className="text-blue-600 mr-1">💼</span>
          Careers:
        </h4>
        <div className="flex flex-wrap gap-2">
          {course.careers.map((career, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium"
            >
              {career}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-700 mb-2 flex items-center">
          <span className="text-green-600 mr-1">📚</span>
          Higher Studies:
        </h4>
        <div className="space-y-1">
          {course.higherStudies.map((study, index) => (
            <p key={index} className="text-green-700 italic text-sm">
              • {study}
            </p>
          ))}
        </div>
      </div>
      </motion.div>
    );
  };

  const CollegeCard = ({ college, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-transparent hover:border-indigo-500"
    >
      <div className="flex items-start mb-4">
        <Building2 className="w-8 h-8 text-indigo-600 mr-3 mt-1 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{college.name}</h3>
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{college.location}</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2 flex items-center">
          <span className="text-blue-600 mr-1">📚</span>
          Courses:
        </h4>
        <div className="flex flex-wrap gap-2">
          {college.courses.map((course, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium"
            >
              {course}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-700 mb-2 flex items-center">
          <span className="text-green-600 mr-1">🏢</span>
          Facilities:
        </h4>
        <div className="flex flex-wrap gap-2">
          {college.facilities.map((facility, index) => (
            <span
              key={index}
              className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium"
            >
              {facility}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const EventCard = ({ event, index }) => {
    const eventConfig = getEventConfig(event.type);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-transparent hover:border-indigo-500"
      >
        <div className="flex items-start gap-3 mb-4">
          <CalendarDays className="w-8 h-8 text-indigo-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {event.title}
            </h3>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDate(event.date)}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={eventConfig.badgeClass}>
                {event.type}
              </span>
              <button
                onClick={() => generateCalendarLink(event)}
                className="text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Add to Calendar
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const EmptyState = ({ icon: Icon, title, description }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white shadow-lg rounded-xl p-8 text-center border border-gray-200 col-span-full"
    >
      <Icon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );

  // Prevent hydration mismatch
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-lg font-medium text-gray-700">Loading your recommendations...</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto p-6">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            🎯 Your Personalized Career Roadmap
          </h1>

          {/* Class Level Badge */}
          {recommendations.classLevel && (
            <div className="mb-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
                {recommendations.classLevel === '10' && 'Currently in Class 10'}
                {recommendations.classLevel === '12' && 'Currently in Class 12'}
                {recommendations.classLevel === 'UG' && 'Undergraduate Student'}
                {recommendations.classLevel === 'PG' && 'Postgraduate Student'}
              </span>
            </div>
          )}

          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Tailored course, college, and career suggestions just for you based on your quiz results and profile.
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 text-red-800 border border-red-300 rounded-lg p-3 mb-8 text-center max-w-2xl mx-auto"
          >
            {error}
          </motion.div>
        )}

        {/* Suggested Courses Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <dynamicContent.coursesIcon className="w-8 h-8 mr-3 text-indigo-600" />
            {dynamicContent.coursesTitle}
          </h2>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {recommendations.courses && recommendations.courses.length > 0 ? (
              recommendations.courses.map((course, index) => (
                <CourseCard key={index} course={course} index={index} />
              ))
            ) : (
              <EmptyState
                icon={dynamicContent.coursesIcon}
                title="No recommendations yet"
                description={dynamicContent.coursesEmptyMessage}
              />
            )}
          </div>
        </motion.section>

        {/* Careers Section (UG/PG only) */}
        {(recommendations.classLevel === 'UG' || recommendations.classLevel === 'PG') && recommendations.careers && recommendations.careers.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Briefcase className="w-8 h-8 mr-3 text-indigo-600" />
              💼 Career Opportunities
            </h2>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {recommendations.careers.map((career, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-transparent hover:border-indigo-500"
                >
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-indigo-600" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 text-center">{career}</h3>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Suggested Colleges/Career Paths Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Building2 className="w-8 h-8 mr-3 text-indigo-600" />
            {dynamicContent.collegesTitle}
          </h2>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {recommendations.colleges && recommendations.colleges.length > 0 ? (
              recommendations.colleges.map((college, index) => (
                <CollegeCard key={index} college={college} index={index} />
              ))
            ) : (
              <EmptyState
                icon={Building2}
                title="No recommendations yet"
                description={dynamicContent.collegesEmptyMessage}
              />
            )}
          </div>
        </motion.section>

        {/* Upcoming Events Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <CalendarDays className="w-8 h-8 mr-3 text-indigo-600" />
            {dynamicContent.eventsTitle}
          </h2>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {recommendations.events && recommendations.events.length > 0 ? (
              recommendations.events.map((event, index) => (
                <EventCard key={index} event={event} index={index} />
              ))
            ) : (
              <EmptyState
                icon={CalendarDays}
                title="No upcoming events"
                description="Check back soon for relevant admission and scholarship deadlines."
              />
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );
}