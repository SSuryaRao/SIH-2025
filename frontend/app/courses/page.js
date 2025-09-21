'use client';

import { useState, useEffect } from 'react';

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
      const response = await fetch('http://localhost:4000/api/courses');
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
      const response = await fetch(`http://localhost:4000/api/courses/${searchTerm.trim()}`);
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

  const CourseCard = ({ course }) => (
    <div className="bg-white shadow rounded p-4 mb-4">
      <h2 className="text-xl font-semibold mb-2">{course.course}</h2>

      <div className="mb-3">
        <h3 className="font-medium text-gray-700 mb-1">Careers:</h3>
        <ul className="list-disc ml-5 text-sm">
          {course.careers.map((career, index) => (
            <li key={index}>{career}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-medium text-gray-700 mb-1">Higher Studies:</h3>
        <ul className="list-disc ml-5 text-sm">
          {course.higherStudies.map((study, index) => (
            <li key={index}>{study}</li>
          ))}
        </ul>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Course to Career Mapping
        </h1>

        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search for a course (e.g., bsc, bcom, btech)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
            {showSearchResult && (
              <button
                type="button"
                onClick={clearSearch}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {error && (
          <div className="text-center text-red-600 text-sm mb-4">
            {error}
          </div>
        )}

        {showSearchResult ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">Search Results:</h2>
            {searchResult ? (
              <CourseCard course={searchResult} />
            ) : (
              <div className="bg-white shadow rounded p-4 mb-4 text-center text-gray-600">
                No course found for "{searchTerm}"
              </div>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-4">All Courses:</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
              {courses.map((course, index) => (
                <CourseCard key={index} course={course} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}