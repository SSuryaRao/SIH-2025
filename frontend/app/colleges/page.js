'use client';

import { useState, useEffect } from 'react';

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

  const CollegeCard = ({ college }) => (
    <div className="bg-white shadow rounded p-4 mb-4">
      <h2 className="text-lg font-semibold mb-1">{college.name}</h2>
      <p className="text-gray-600 mb-2">{college.location}</p>

      <div className="mb-2">
        <span className="font-medium text-gray-700">Courses: </span>
        <span className="text-sm">{college.courses.join(', ')}</span>
      </div>

      <div>
        <span className="font-medium text-gray-700">Facilities: </span>
        <span className="text-sm">{college.facilities.join(', ')}</span>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg">Loading colleges...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Government Colleges Directory
        </h1>

        <div className="bg-white shadow rounded p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Find Nearby Colleges</h2>

          <form onSubmit={handleNearbySearch} className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <input
                type="number"
                step="any"
                placeholder="Latitude"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="border p-2 rounded mr-2 flex-1 min-w-32"
              />
              <input
                type="number"
                step="any"
                placeholder="Longitude"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="border p-2 rounded mr-2 flex-1 min-w-32"
              />
              <input
                type="number"
                placeholder="Radius (km)"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                className="border p-2 rounded mr-2 flex-1 min-w-32"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSearching}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {isSearching ? 'Searching...' : 'Find Nearby'}
              </button>

              {showNearbyResult && (
                <button
                  type="button"
                  onClick={clearNearbySearch}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Clear Search
                </button>
              )}
            </div>
          </form>
        </div>

        {error && (
          <div className="text-center text-red-600 text-sm mb-4">
            {error}
          </div>
        )}

        {showNearbyResult ? (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Nearby Colleges (within {radius}km):
            </h2>
            {nearbyColleges && nearbyColleges.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                {nearbyColleges.map((college) => (
                  <CollegeCard key={college.id} college={college} />
                ))}
              </div>
            ) : (
              <div className="bg-white shadow rounded p-4 mb-4 text-center text-gray-600">
                No colleges found nearby within {radius}km radius.
              </div>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-4">All Colleges:</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
              {colleges.map((college) => (
                <CollegeCard key={college.id} college={college} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}