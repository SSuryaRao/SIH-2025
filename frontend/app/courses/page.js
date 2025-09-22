'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, GraduationCap, BookOpen } from 'lucide-react';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const [showSearchResult, setShowSearchResult] = useState(false);

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const fetchAllCourses = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await fetch(apiUrl + '/api/courses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      } else {
        setError('Failed to fetch courses');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setShowSearchResult(false);
      return;
    }

    setIsSearching(true);
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await fetch(apiUrl + '/api/courses/' + searchTerm.trim());
      if (response.ok) {
        const data = await response.json();
        setSearchResult(data);
        setShowSearchResult(true);
      } else {
        setSearchResult(null);
        setShowSearchResult(true);
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResult(null);
    setShowSearchResult(false);
  };

  const CourseCard = ({ course, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-transparent hover:border-indigo-500"
    >
      <div className="flex items-center mb-4">
        <GraduationCap className="w-8 h-8 text-indigo-600 mr-3" />
        <h2 className="text-xl font-semibold text-gray-900">{course.course}</h2>
      </div>

      <div className="mb-4">
        <h3 className="font-medium text-gray-700 mb-2 flex items-center">
          <span className="text-blue-600 mr-1">💼</span>
          Careers:
        </h3>
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
        <h3 className="font-medium text-gray-700 mb-2 flex items-center">
          <span className="text-green-600 mr-1">📚</span>
          Higher Studies:
        </h3>
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-lg font-medium text-gray-700">Loading courses...</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Course to Career Mapping
          </h1>
          <p className="text-gray-600 text-lg">
            Discover career paths and higher education opportunities for your chosen course
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for a course (e.g., B.Sc., B.Tech)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white shadow-md rounded-lg px-12 py-3 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full text-gray-900 placeholder-gray-500"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
                <button
                  type="submit"
                  disabled={isSearching}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium transition"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
                {showSearchResult && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 font-medium transition"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.form>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 text-red-800 border border-red-300 rounded-lg p-3 mb-6 text-center max-w-2xl mx-auto"
          >
            {error}
          </motion.div>
        )}

        {showSearchResult ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 flex items-center">
              <Search className="w-6 h-6 mr-2 text-indigo-600" />
              Search Results:
            </h2>
            {searchResult ? (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <CourseCard course={searchResult} index={0} />
              </div>
            ) : (
              <div className="bg-white shadow-lg rounded-xl p-8 text-center border border-gray-200">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-600">
                  No course found for "{searchTerm}". Try another search term.
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 flex items-center">
              <GraduationCap className="w-6 h-6 mr-2 text-indigo-600" />
              All Courses:
            </h2>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course, index) => (
                <CourseCard key={index} course={course} index={index} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}