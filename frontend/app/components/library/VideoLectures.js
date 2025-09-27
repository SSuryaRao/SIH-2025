'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, Users, BookOpen, ExternalLink, Bookmark } from 'lucide-react';

export default function VideoLectures() {
  const [activeVideo, setActiveVideo] = useState(null);

  // Mock video lecture data
  const videoLectures = [
    {
      id: 1,
      title: 'Complete Linear Algebra for Engineers',
      instructor: 'Prof. Gilbert Strang',
      institution: 'MIT OpenCourseWare',
      duration: '18:30:00',
      views: '2.3M',
      rating: 4.9,
      description: 'Comprehensive linear algebra course covering vectors, matrices, eigenvalues, and applications in engineering.',
      thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600',
      embedUrl: 'https://www.youtube.com/embed/QVKj3LADCnA', // MIT Linear Algebra
      topics: ['Vectors', 'Matrices', 'Eigenvalues', 'Linear Systems'],
      level: 'Intermediate',
      language: 'English',
      subtitles: true
    },
    {
      id: 2,
      title: 'Organic Chemistry Fundamentals',
      instructor: 'Dr. Sunita Varjani',
      institution: 'NPTEL',
      duration: '25:45:00',
      views: '1.8M',
      rating: 4.7,
      description: 'Essential organic chemistry concepts with mechanisms, reactions, and practical applications.',
      thumbnail: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600',
      embedUrl: 'https://www.youtube.com/embed/dDt_miEQ4ck', // Chemistry basics
      topics: ['Functional Groups', 'Reaction Mechanisms', 'Stereochemistry', 'Synthesis'],
      level: 'Beginner',
      language: 'English',
      subtitles: true
    },
    {
      id: 3,
      title: 'Data Structures and Algorithms',
      instructor: 'Prof. Naveen Garg',
      institution: 'IIT Delhi',
      duration: '32:15:00',
      views: '3.1M',
      rating: 4.8,
      description: 'Complete DSA course covering arrays, linked lists, trees, graphs, sorting, and dynamic programming.',
      thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600',
      embedUrl: 'https://www.youtube.com/embed/0IAPZzGSbME', // DSA tutorial
      topics: ['Arrays', 'Trees', 'Graphs', 'Dynamic Programming'],
      level: 'Intermediate',
      language: 'English',
      subtitles: true
    }
  ];

  const handlePlayVideo = (video) => {
    setActiveVideo(video.id);
    // In a real app, this would open a video player or redirect to the video
    alert(`🎥 Playing: ${video.title}\n\nInstructor: ${video.instructor}\nDuration: ${video.duration}\n\nThis would open the video player.`);
  };

  const handleBookmarkVideo = (videoId) => {
    alert(`🔖 Video bookmarked! Video ID: ${videoId}`);
  };

  const handleViewCourse = (video) => {
    alert(`🔗 Opening course page for: ${video.title}\n\nThis would redirect to the full course on ${video.institution}.`);
  };

  const getLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>🎬</span>
            Video Lectures
          </h2>
          <p className="text-gray-600 mt-1">High-quality educational videos from top institutions</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2"
        >
          <ExternalLink size={16} />
          Browse All Videos
        </motion.button>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {videoLectures.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            {/* Video Thumbnail */}
            <div className="relative group">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-48 object-cover"
              />

              {/* Play Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handlePlayVideo(video)}
                  className="p-4 bg-white bg-opacity-90 rounded-full text-blue-600 hover:bg-white transition-all duration-200"
                >
                  <Play size={24} fill="currentColor" />
                </motion.button>
              </div>

              {/* Duration Badge */}
              <div className="absolute bottom-3 right-3 px-2 py-1 bg-black bg-opacity-70 text-white text-xs rounded flex items-center gap-1">
                <Clock size={12} />
                {video.duration}
              </div>

              {/* Level Badge */}
              <div className="absolute top-3 left-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(video.level)}`}>
                  {video.level}
                </span>
              </div>

              {/* Bookmark Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleBookmarkVideo(video.id)}
                className="absolute top-3 right-3 p-2 bg-black bg-opacity-60 text-white rounded-full hover:bg-yellow-500 transition-colors"
                title="Bookmark video"
              >
                <Bookmark size={14} />
              </motion.button>
            </div>

            {/* Video Info */}
            <div className="p-5">
              <div className="mb-3">
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
                <p className="text-sm text-blue-600 mb-1">by {video.instructor}</p>
                <p className="text-xs text-gray-500 mb-2">{video.institution}</p>
                <p className="text-sm text-gray-600 line-clamp-2">{video.description}</p>
              </div>

              {/* Topics */}
              <div className="flex flex-wrap gap-1 mb-4">
                {video.topics.slice(0, 3).map((topic, topicIndex) => (
                  <span
                    key={topicIndex}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md"
                  >
                    {topic}
                  </span>
                ))}
                {video.topics.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                    +{video.topics.length - 3}
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    ⭐ {video.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={12} />
                    {video.views}
                  </span>
                </div>
                {video.subtitles && (
                  <span className="flex items-center gap-1 text-green-600">
                    📝 CC
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePlayVideo(video)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Play size={14} />
                  Watch Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleViewCourse(video)}
                  className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  title="View full course"
                >
                  <BookOpen size={14} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-600">
          Showing {videoLectures.length} featured video lectures
        </div>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 text-sm font-medium"
          >
            📺 Browse by Subject
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-sm font-medium"
          >
            🎓 View All Courses
          </motion.button>
        </div>
      </div>

      {/* Platform Info */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">🎯</span>
          <h4 className="font-semibold text-gray-900">Learning Partners</h4>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Our video content is sourced from top educational institutions and platforms:
        </p>
        <div className="flex flex-wrap gap-2">
          {['MIT OpenCourseWare', 'NPTEL', 'IIT Delhi', 'Khan Academy', 'Coursera'].map((platform, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-white text-gray-700 text-xs rounded-full border"
            >
              {platform}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}