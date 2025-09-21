'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Ruler, GraduationCap, University, Building2 } from 'lucide-react';

export default function CollegesPage() {
  const [colleges, setColleges] = useState([]);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [radius, setRadius] = useState('');
  const [nearbyColleges, setNearbyColleges] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');
  const [showNearbyResult, setShowNearbyResult] = useState(false);

  useEffect(() => {
    fetchAllColleges();
  }, []);

  const fetchAllColleges = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/colleges');
      if (response.ok) {
        const data = await response.json();
        setColleges(data);
      } else {
        setError('Failed to fetch colleges');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNearbySearch = async (e) => {
    e.preventDefault();

    if (!latitude || !longitude || !radius) {
      setError('Please fill in all location fields');
      return;
    }

    setIsSearching(true);
    setError('');

    try {
      const response = await fetch(
        `http://localhost:4000/api/colleges/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`
      );

      if (response.ok) {
        const data = await response.json();
        setNearbyColleges(data);
        setShowNearbyResult(true);
      } else {
        setError('Failed to search nearby colleges');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setIsSearching(false);
    }
  };

  const clearNearbySearch = () => {
    setLatitude('');
    setLongitude('');
    setRadius('');
    setNearbyColleges(null);
    setShowNearbyResult(false);
  };

  const CollegeCard = ({ college, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-transparent hover:border-indigo-500"
    >
      <div className="flex items-start mb-4">
        <GraduationCap className="w-8 h-8 text-indigo-600 mr-3 mt-1 flex-shrink-0" />
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{college.name}</h2>
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{college.location}</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-medium text-gray-700 mb-2 flex items-center">
          <span className="text-blue-600 mr-1">📚</span>
          Courses:
        </h3>
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
        <h3 className="font-medium text-gray-700 mb-2 flex items-center">
          <span className="text-green-600 mr-1">🏢</span>
          Facilities:
        </h3>
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-lg font-medium text-gray-700">Loading colleges...</div>
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
            Government Colleges Directory
          </h1>
          <p className="text-gray-600 text-lg">
            Discover government colleges near you and explore their offerings
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white shadow-lg rounded-xl p-6 mb-8"
        >
          <h2 className="text-xl font-semibold mb-6 flex items-center text-black">
            <MapPin className="w-6 h-6 mr-2 text-indigo-900" />
            Find Nearby Colleges
          </h2>

          <form onSubmit={handleNearbySearch} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  step="any"
                  placeholder="Latitude"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="bg-white shadow-md rounded-lg pl-10 pr-4 py-3 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full text-gray-900 placeholder-gray-500"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  step="any"
                  placeholder="Longitude"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="bg-white shadow-md rounded-lg pl-10 pr-4 py-3 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full text-gray-900 placeholder-gray-500"
                />
              </div>
              <div className="relative">
                <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  placeholder="Radius (km)"
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                  className="bg-white shadow-md rounded-lg pl-10 pr-4 py-3 border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSearching}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 font-medium transition flex items-center gap-2"
              >
                <MapPin className="w-5 h-5" />
                {isSearching ? 'Searching...' : 'Find Nearby'}
              </button>

              {showNearbyResult && (
                <button
                  type="button"
                  onClick={clearNearbySearch}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 font-medium transition"
                >
                  Clear Search
                </button>
              )}
            </div>
          </form>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 text-red-800 border border-red-300 rounded-lg p-3 mb-6 text-center max-w-2xl mx-auto"
          >
            {error}
          </motion.div>
        )}

        {showNearbyResult ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 flex items-center">
              <MapPin className="w-6 h-6 mr-2 text-indigo-600" />
              Nearby Colleges (within {radius}km):
            </h2>
            {nearbyColleges && nearbyColleges.length > 0 ? (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {nearbyColleges.map((college, index) => (
                  <CollegeCard key={college.id} college={college} index={index} />
                ))}
              </div>
            ) : (
              <div className="bg-white shadow-lg rounded-xl p-8 text-center border border-gray-200">
                <University className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No colleges found nearby</h3>
                <p className="text-gray-600">
                  Try expanding your search radius to find more colleges in your area.
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
              <Building2 className="w-6 h-6 mr-2 text-indigo-600" />
              All Colleges:
            </h2>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {colleges.map((college, index) => (
                <CollegeCard key={college.id} college={college} index={index} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}