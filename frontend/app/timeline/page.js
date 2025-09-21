'use client';

import { useState, useEffect } from 'react';

export default function TimelinePage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTimeline();
  }, []);

  const fetchTimeline = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/timeline');
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        setError('Failed to fetch timeline events');
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

  const getBadgeStyles = (type) => {
    switch (type) {
      case 'admission':
        return 'inline-block px-2 py-1 text-xs rounded bg-blue-100 text-blue-700';
      case 'scholarship':
        return 'inline-block px-2 py-1 text-xs rounded bg-green-100 text-green-700';
      default:
        return 'inline-block px-2 py-1 text-xs rounded bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg">Loading timeline...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Academic Timeline
        </h1>

        {error && (
          <div className="text-center text-red-600 text-sm mb-4">
            {error}
          </div>
        )}

        <div className="mt-6">
          {events.length > 0 ? (
            events.map((event) => (
              <div key={event.id} className="border-l-2 border-blue-500 pl-4 mb-4">
                <div className="text-sm text-gray-500 mb-1">
                  {formatDate(event.date)}
                </div>
                <div className="font-semibold text-gray-900 mb-2">
                  {event.title}
                </div>
                <div>
                  <span className={getBadgeStyles(event.type)}>
                    {event.type}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-600">
              No timeline events available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}