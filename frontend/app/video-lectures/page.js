'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, Users, Star, BookOpen, Filter, Search, Download } from 'lucide-react';

export default function VideoLecturesPage() {
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Dummy video lectures data
  const videoLectures = [
    {
      id: 1,
      title: 'Linear Algebra Complete Course',
      instructor: 'Prof. Gilbert Strang',
      institution: 'MIT OpenCourseWare',
      subject: 'Mathematics',
      level: 'Intermediate',
      duration: '35:20:00',
      views: '2.3M',
      rating: 4.9,
      lectures: 35,
      description: 'Complete linear algebra course covering vectors, matrices, eigenvalues, and applications.',
      thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600',
      topics: ['Vectors', 'Matrices', 'Eigenvalues', 'Linear Systems', 'Applications'],
      language: 'English',
      subtitles: true,
      downloadable: true
    },
    {
      id: 2,
      title: 'Organic Chemistry Fundamentals',
      instructor: 'Dr. Sunita Varjani',
      institution: 'NPTEL',
      subject: 'Chemistry',
      level: 'Beginner',
      duration: '28:45:00',
      views: '1.8M',
      rating: 4.7,
      lectures: 42,
      description: 'Essential organic chemistry concepts with mechanisms and reactions.',
      thumbnail: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600',
      topics: ['Functional Groups', 'Reaction Mechanisms', 'Stereochemistry', 'Synthesis'],
      language: 'English',
      subtitles: true,
      downloadable: false
    },
    {
      id: 3,
      title: 'Data Structures and Algorithms',
      instructor: 'Prof. Naveen Garg',
      institution: 'IIT Delhi',
      subject: 'Computer Science',
      level: 'Intermediate',
      duration: '45:15:00',
      views: '3.1M',
      rating: 4.8,
      lectures: 50,
      description: 'Complete DSA course covering fundamental and advanced concepts.',
      thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600',
      topics: ['Arrays', 'Trees', 'Graphs', 'Dynamic Programming', 'Sorting'],
      language: 'English',
      subtitles: true,
      downloadable: true
    },
    {
      id: 4,
      title: 'Physics for Engineers',
      instructor: 'Dr. Ramamurti Shankar',
      institution: 'Yale University',
      subject: 'Physics',
      level: 'Beginner',
      duration: '32:30:00',
      views: '1.5M',
      rating: 4.6,
      lectures: 24,
      description: 'Fundamental physics concepts for engineering students.',
      thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600',
      topics: ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Waves'],
      language: 'English',
      subtitles: true,
      downloadable: false
    },
    {
      id: 5,
      title: 'Machine Learning Specialization',
      instructor: 'Andrew Ng',
      institution: 'Stanford University',
      subject: 'Computer Science',
      level: 'Advanced',
      duration: '54:00:00',
      views: '4.2M',
      rating: 4.9,
      lectures: 60,
      description: 'Comprehensive machine learning course from basics to advanced topics.',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600',
      topics: ['Neural Networks', 'Deep Learning', 'Supervised Learning', 'Unsupervised Learning'],
      language: 'English',
      subtitles: true,
      downloadable: true
    },
    {
      id: 6,
      title: 'Microeconomics Principles',
      instructor: 'Prof. Tyler Cowen',
      institution: 'Marginal Revolution University',
      subject: 'Economics',
      level: 'Beginner',
      duration: '22:15:00',
      views: '890K',
      rating: 4.5,
      lectures: 18,
      description: 'Introduction to microeconomic theory and applications.',
      thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600',
      topics: ['Supply & Demand', 'Market Structures', 'Consumer Theory', 'Game Theory'],
      language: 'English',
      subtitles: true,
      downloadable: false
    },
    {
      id: 7,
      title: 'Digital Signal Processing',
      instructor: 'Prof. S.C. Dutta Roy',
      institution: 'IIT Delhi',
      subject: 'Engineering',
      level: 'Advanced',
      duration: '38:45:00',
      views: '1.2M',
      rating: 4.7,
      lectures: 40,
      description: 'Advanced digital signal processing techniques and applications.',
      thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600',
      topics: ['Fourier Transform', 'Filters', 'Sampling', 'Z-Transform'],
      language: 'English',
      subtitles: false,
      downloadable: true
    },
    {
      id: 8,
      title: 'World History Overview',
      instructor: 'Dr. John Green',
      institution: 'Crash Course',
      subject: 'History',
      level: 'Beginner',
      duration: '15:30:00',
      views: '5.8M',
      rating: 4.4,
      lectures: 42,
      description: 'Engaging overview of world history from ancient to modern times.',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
      topics: ['Ancient Civilizations', 'Renaissance', 'Industrial Revolution', 'Modern Era'],
      language: 'English',
      subtitles: true,
      downloadable: false
    }
  ];

  const subjects = ['all', 'Mathematics', 'Computer Science', 'Physics', 'Chemistry', 'Engineering', 'Economics', 'History'];
  const levels = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  // Filter videos
  const filteredVideos = videoLectures.filter(video => {
    const matchesSearch = searchTerm === '' ||
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSubject = selectedSubject === 'all' || video.subject === selectedSubject;
    const matchesLevel = selectedLevel === 'all' || video.level === selectedLevel;

    return matchesSearch && matchesSubject && matchesLevel;
  });

  const getLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handlePlayVideo = (video) => {
    alert(`🎥 Playing: ${video.title}\n\nInstructor: ${video.instructor}\nDuration: ${video.duration}\nLectures: ${video.lectures}\n\nThis would open the video player.`);
  };

  const handleDownloadVideo = (video) => {
    if (video.downloadable) {
      alert(`⬇️ Downloading: ${video.title}\n\nThis would start the download process.`);
    } else {
      alert(`❌ Download not available for: ${video.title}\n\nThis course is only available for online streaming.`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
              🎬 Video Lectures Library
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
              Access high-quality educational videos from top universities and institutions worldwide
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold">{videoLectures.length}+</div>
                <div className="text-white/80">Course Series</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{videoLectures.reduce((sum, video) => sum + video.lectures, 0)}+</div>
                <div className="text-white/80">Total Lectures</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50+</div>
                <div className="text-white/80">Universities</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">Free</div>
                <div className="text-white/80">Access</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search videos, instructors, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>
                      {subject === 'all' ? 'All Subjects' : subject}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  {levels.map(level => (
                    <option key={level} value={level}>
                      {level === 'all' ? 'All Levels' : level}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredVideos.length} of {videoLectures.length} video courses
            </div>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
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

                  {/* Downloadable Badge */}
                  {video.downloadable && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                        ⬇️ Downloadable
                      </span>
                    </div>
                  )}
                </div>

                {/* Video Info */}
                <div className="p-6">
                  <div className="mb-4">
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
                        <Star size={12} fill="currentColor" className="text-yellow-500" />
                        {video.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={12} />
                        {video.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen size={12} />
                        {video.lectures} lectures
                      </span>
                    </div>
                    {video.subtitles && (
                      <span className="text-green-600">CC</span>
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
                      onClick={() => handleDownloadVideo(video)}
                      className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                        video.downloadable
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                      disabled={!video.downloadable}
                      title={video.downloadable ? 'Download course' : 'Download not available'}
                    >
                      <Download size={14} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* No Results */}
          {filteredVideos.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No videos found</h3>
              <p className="text-gray-600">
                Try adjusting your search terms or filters.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}