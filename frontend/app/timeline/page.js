'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, GraduationCap, Download } from 'lucide-react';

export default function TimelinePage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTimeline();
  }, []);

  const fetchTimeline = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await fetch(apiUrl + '/api/timeline');
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

    return day + ' ' + month + ' ' + year;
  };

  const getEventConfig = (type) => {
    switch (type) {
      case 'admission':
        return {
          color: 'blue',
          bgColor: 'bg-blue-500',
          badgeClass: 'bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium',
          icon: GraduationCap
        };
      case 'scholarship':
        return {
          color: 'green',
          bgColor: 'bg-green-500',
          badgeClass: 'bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium',
          icon: GraduationCap
        };
      default:
        return {
          color: 'orange',
          bgColor: 'bg-orange-500',
          badgeClass: 'bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium',
          icon: Calendar
        };
    }
  };

  const generateCalendarLink = (event) => {
    const startDate = new Date(event.date);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration

    const formatCalendarDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const calendarData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Digital Guidance Platform//Timeline Event//EN',
      'BEGIN:VEVENT',
      'DTSTART:' + formatCalendarDate(startDate),
      'DTEND:' + formatCalendarDate(endDate),
      'SUMMARY:' + event.title,
      'DESCRIPTION:' + event.type + ' event',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([calendarData], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = event.title.replace(/\s+/g, '_') + '.ics';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-lg font-medium text-gray-700">Loading timeline...</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
             Admission & Scholarship Timeline
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Stay updated with important dates and deadlines to never miss an opportunity.
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

        {/* Timeline */}
        <div className="relative">
          {events.length > 0 ? (
            <>
              {/* Vertical line - hidden on mobile */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 h-full hidden md:block"></div>

              <div className="space-y-8 md:space-y-12">
                {events.map((event, index) => {
                  const eventConfig = getEventConfig(event.type);
                  const IconComponent = eventConfig.icon;
                  const isEven = index % 2 === 0;

                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className={`relative flex items-center ${
                        isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                      } flex-col md:gap-8`}
                    >
                      {/* Event Card */}
                      <div className={`w-full md:w-5/12 ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                        <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-transparent hover:border-indigo-500">
                          <div className="flex items-start gap-3 mb-4">
                            <IconComponent className={`w-6 h-6 ${eventConfig.color === 'blue' ? 'text-blue-600' : eventConfig.color === 'green' ? 'text-green-600' : 'text-orange-600'} flex-shrink-0 mt-1`} />
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
                        </div>
                      </div>

                      {/* Timeline Marker */}
                      <div className="relative z-10 flex items-center justify-center">
                        <div className={`w-12 h-12 ${eventConfig.bgColor} rounded-full flex items-center justify-center shadow-lg border-4 border-white`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                      </div>

                      {/* Spacer for desktop */}
                      <div className="w-full md:w-5/12 hidden md:block"></div>
                    </motion.div>
                  );
                })}
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white shadow-lg rounded-xl p-12 text-center border border-gray-200"
            >
              <Calendar className="w-20 h-20 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No upcoming events</h3>
              <p className="text-gray-600">
                Check back soon for important admission and scholarship deadlines!
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}