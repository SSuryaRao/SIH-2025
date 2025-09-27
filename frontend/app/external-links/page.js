'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Star, Users, Globe, Search, Filter, Bookmark, Clock, Award } from 'lucide-react';

export default function ExternalLinksPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarkedItems, setBookmarkedItems] = useState([1, 4, 7, 12]);

  // Dummy external links data
  const externalLinks = [
    {
      id: 1,
      title: 'Khan Academy',
      url: 'https://www.khanacademy.org',
      category: 'Learning Platform',
      type: 'Educational',
      description: 'Free world-class education for anyone, anywhere. Comprehensive courses in math, science, and more.',
      features: ['Interactive Exercises', 'Personalized Learning', 'Progress Tracking', 'Free Access'],
      rating: 4.8,
      users: '120M+',
      languages: ['English', 'Spanish', 'Hindi', 'French'],
      subjects: ['Mathematics', 'Science', 'Computing', 'Arts & Humanities'],
      thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400',
      verified: true,
      institution: 'Khan Academy',
      country: 'USA'
    },
    {
      id: 2,
      title: 'MIT OpenCourseWare',
      url: 'https://ocw.mit.edu',
      category: 'University Course',
      type: 'Academic',
      description: 'Free lecture notes, exams, and videos from MIT. Access course materials from over 2,400 MIT courses.',
      features: ['University Level', 'Complete Courses', 'Research Materials', 'Free Access'],
      rating: 4.9,
      users: '50M+',
      languages: ['English'],
      subjects: ['Engineering', 'Science', 'Mathematics', 'Business'],
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      verified: true,
      institution: 'MIT',
      country: 'USA'
    },
    {
      id: 3,
      title: 'Coursera',
      url: 'https://www.coursera.org',
      category: 'MOOC Platform',
      type: 'Professional',
      description: 'Online courses and certificates from top universities and companies. Learn career-relevant skills.',
      features: ['University Partnerships', 'Certificates', 'Career Services', 'Financial Aid'],
      rating: 4.6,
      users: '100M+',
      languages: ['English', 'Spanish', 'French', 'Chinese'],
      subjects: ['Technology', 'Business', 'Data Science', 'Health'],
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
      verified: true,
      institution: 'Coursera Inc.',
      country: 'USA'
    },
    {
      id: 4,
      title: 'NPTEL',
      url: 'https://nptel.ac.in',
      category: 'Government Platform',
      type: 'Academic',
      description: 'National Programme on Technology Enhanced Learning. Free engineering and science courses by IITs.',
      features: ['IIT/IISc Faculty', 'Engineering Focus', 'Hindi Support', 'Certification'],
      rating: 4.7,
      users: '25M+',
      languages: ['English', 'Hindi'],
      subjects: ['Engineering', 'Science', 'Mathematics', 'Management'],
      thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400',
      verified: true,
      institution: 'IIT/IISc',
      country: 'India'
    },
    {
      id: 5,
      title: 'edX',
      url: 'https://www.edx.org',
      category: 'MOOC Platform',
      type: 'Educational',
      description: 'High-quality courses from the world\'s best universities and institutions. Free and paid options.',
      features: ['Harvard/MIT Founded', 'MicroMasters', 'Verified Certificates', 'Mobile App'],
      rating: 4.5,
      users: '40M+',
      languages: ['English', 'Spanish', 'Chinese', 'French'],
      subjects: ['Computer Science', 'Business', 'Engineering', 'Language'],
      thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400',
      verified: true,
      institution: 'edX',
      country: 'USA'
    },
    {
      id: 6,
      title: 'Codecademy',
      url: 'https://www.codecademy.com',
      category: 'Coding Platform',
      type: 'Technical',
      description: 'Interactive coding lessons and projects. Learn programming languages and technical skills.',
      features: ['Hands-on Coding', 'Interactive Projects', 'Career Paths', 'Code Practice'],
      rating: 4.4,
      users: '50M+',
      languages: ['English'],
      subjects: ['Programming', 'Web Development', 'Data Science', 'Machine Learning'],
      thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400',
      verified: true,
      institution: 'Codecademy',
      country: 'USA'
    },
    {
      id: 7,
      title: 'BYJU\'S',
      url: 'https://byjus.com',
      category: 'EdTech Platform',
      type: 'K-12',
      description: 'Personalized learning app for K-12 students. Interactive video lessons and practice tests.',
      features: ['K-12 Focus', 'Video Lessons', 'Practice Tests', 'Doubt Solving'],
      rating: 4.3,
      users: '150M+',
      languages: ['English', 'Hindi'],
      subjects: ['Mathematics', 'Science', 'English', 'Competitive Exams'],
      thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400',
      verified: true,
      institution: 'BYJU\'S',
      country: 'India'
    },
    {
      id: 8,
      title: 'Unacademy',
      url: 'https://unacademy.com',
      category: 'Test Prep',
      type: 'Competitive',
      description: 'Live classes and test preparation for competitive exams. Expert educators and comprehensive courses.',
      features: ['Live Classes', 'Test Prep', 'Expert Educators', 'Doubt Resolution'],
      rating: 4.2,
      users: '60M+',
      languages: ['English', 'Hindi'],
      subjects: ['JEE', 'NEET', 'UPSC', 'Banking Exams'],
      thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400',
      verified: true,
      institution: 'Unacademy',
      country: 'India'
    },
    {
      id: 9,
      title: 'FreeCodeCamp',
      url: 'https://www.freecodecamp.org',
      category: 'Coding Platform',
      type: 'Technical',
      description: 'Learn to code for free. Interactive coding challenges and projects with certificates.',
      features: ['100% Free', 'Project-Based', 'Certificates', 'Community Support'],
      rating: 4.8,
      users: '40M+',
      languages: ['English', 'Spanish', 'Chinese', 'Portuguese'],
      subjects: ['Web Development', 'JavaScript', 'Python', 'Data Science'],
      thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400',
      verified: true,
      institution: 'freeCodeCamp',
      country: 'USA'
    },
    {
      id: 10,
      title: 'Duolingo',
      url: 'https://www.duolingo.com',
      category: 'Language Learning',
      type: 'Language',
      description: 'Fun and effective language learning. Gamified lessons for over 40 languages.',
      features: ['Gamified Learning', '40+ Languages', 'Mobile App', 'Progress Tracking'],
      rating: 4.6,
      users: '500M+',
      languages: ['Multiple'],
      subjects: ['Languages', 'Communication'],
      thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
      verified: true,
      institution: 'Duolingo',
      country: 'USA'
    },
    {
      id: 11,
      title: 'Brilliant',
      url: 'https://brilliant.org',
      category: 'STEM Platform',
      type: 'Educational',
      description: 'Interactive problem-solving courses in math, science, and computer science.',
      features: ['Problem-Solving', 'Visual Learning', 'STEM Focus', 'Interactive'],
      rating: 4.5,
      users: '10M+',
      languages: ['English'],
      subjects: ['Mathematics', 'Science', 'Computer Science', 'Engineering'],
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400',
      verified: true,
      institution: 'Brilliant',
      country: 'USA'
    },
    {
      id: 12,
      title: 'TED-Ed',
      url: 'https://ed.ted.com',
      category: 'Educational Content',
      type: 'Educational',
      description: 'Short animated educational videos on various topics. Thought-provoking content for learners.',
      features: ['Short Videos', 'Animated Content', 'Diverse Topics', 'Free Access'],
      rating: 4.7,
      users: '30M+',
      languages: ['English', 'Spanish', 'Arabic', 'Chinese'],
      subjects: ['Science', 'Arts', 'Literature', 'Philosophy'],
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
      verified: true,
      institution: 'TED',
      country: 'USA'
    }
  ];

  const categories = ['all', 'Learning Platform', 'University Course', 'MOOC Platform', 'Coding Platform', 'EdTech Platform', 'Test Prep', 'Language Learning', 'STEM Platform', 'Educational Content', 'Government Platform'];
  const types = ['all', 'Educational', 'Academic', 'Professional', 'Technical', 'K-12', 'Competitive', 'Language'];

  // Filter links
  const filteredLinks = externalLinks.filter(link => {
    const matchesSearch = searchTerm === '' ||
      link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || link.category === selectedCategory;
    const matchesType = selectedType === 'all' || link.type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  const handleBookmark = (linkId) => {
    setBookmarkedItems(prev => {
      if (prev.includes(linkId)) {
        return prev.filter(id => id !== linkId);
      } else {
        return [...prev, linkId];
      }
    });
  };

  const handleVisitLink = (link) => {
    // Open the external website in a new tab
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Learning Platform': 'bg-blue-100 text-blue-700',
      'University Course': 'bg-purple-100 text-purple-700',
      'MOOC Platform': 'bg-green-100 text-green-700',
      'Coding Platform': 'bg-orange-100 text-orange-700',
      'EdTech Platform': 'bg-pink-100 text-pink-700',
      'Test Prep': 'bg-red-100 text-red-700',
      'Language Learning': 'bg-teal-100 text-teal-700',
      'STEM Platform': 'bg-indigo-100 text-indigo-700',
      'Educational Content': 'bg-yellow-100 text-yellow-700',
      'Government Platform': 'bg-emerald-100 text-emerald-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 via-red-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
              🔗 External Learning Resources
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
              Curated collection of the best educational websites, platforms, and tools from around the world
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold">{externalLinks.length}+</div>
                <div className="text-white/80">Educational Sites</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{categories.length - 1}</div>
                <div className="text-white/80">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{externalLinks.filter(link => link.verified).length}</div>
                <div className="text-white/80">Verified Links</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">Global</div>
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
                  placeholder="Search platforms, subjects, or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  {types.map(type => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Types' : type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredLinks.length} of {externalLinks.length} educational resources
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLinks.map((link, index) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={link.thumbnail}
                    alt={link.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(link.category)}`}>
                      {link.category}
                    </span>
                  </div>

                  {/* Verified Badge */}
                  {link.verified && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                        <Award size={10} />
                        Verified
                      </span>
                    </div>
                  )}

                  {/* Bookmark Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleBookmark(link.id)}
                    className={`absolute bottom-3 right-3 p-2 rounded-full transition-colors ${
                      bookmarkedItems.includes(link.id)
                        ? 'bg-yellow-500 text-white'
                        : 'bg-black bg-opacity-60 text-white hover:bg-yellow-500'
                    }`}
                  >
                    <Bookmark size={14} fill={bookmarkedItems.includes(link.id) ? 'currentColor' : 'none'} />
                  </motion.button>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{link.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Globe size={14} />
                      <span>{link.institution}</span>
                      <span>•</span>
                      <span>{link.country}</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3">{link.description}</p>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-700 mb-2">Key Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {link.features.slice(0, 3).map((feature, featureIndex) => (
                        <span
                          key={featureIndex}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                        >
                          {feature}
                        </span>
                      ))}
                      {link.features.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                          +{link.features.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Subjects */}
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-700 mb-2">Subjects:</h4>
                    <div className="flex flex-wrap gap-1">
                      {link.subjects.slice(0, 3).map((subject, subjectIndex) => (
                        <span
                          key={subjectIndex}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md"
                        >
                          {subject}
                        </span>
                      ))}
                      {link.subjects.length > 3 && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md">
                          +{link.subjects.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Star size={12} fill="currentColor" className="text-yellow-500" />
                        {link.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={12} />
                        {link.users}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {link.languages.length > 1 ? `${link.languages.length} languages` : link.languages[0]}
                    </div>
                  </div>

                  {/* Action Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleVisitLink(link)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
                  >
                    <ExternalLink size={16} />
                    Visit Platform
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* No Results */}
          {filteredLinks.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No resources found</h3>
              <p className="text-gray-600">
                Try adjusting your search terms or filters.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            🌟 Know a Great Educational Resource?
          </h2>
          <p className="text-gray-600 mb-8">
            Help us expand our collection by suggesting educational websites and platforms that have helped you learn.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-200"
            onClick={() => alert('📝 This would open a form to suggest new educational resources.')}
          >
            Suggest a Resource
          </motion.button>
        </div>
      </section>
    </div>
  );
}