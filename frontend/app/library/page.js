'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SearchBar from '../components/library/SearchBar';
import CategoryFilters from '../components/library/CategoryFilters';
import FeaturedResources from '../components/library/FeaturedResources';
import ResourceGrid from '../components/library/ResourceGrid';
import DashboardPreview from '../components/library/DashboardPreview';
import VideoLectures from '../components/library/VideoLectures';

export default function LibraryPage() {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [bookmarkedItems, setBookmarkedItems] = useState([1, 3, 5]); // Mock bookmarked items
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Handlers
  const handleBookmark = (itemId) => {
    setBookmarkedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const handleFilterToggle = () => {
    setIsMobileFilterOpen(prev => !prev);
  };

  const closeMobileFilter = () => {
    setIsMobileFilterOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
              📚 E-Books & Skill Materials Library
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
              Access thousands of free educational resources, e-books, and skill development materials from top institutions worldwide.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="text-3xl font-bold">1,000+</div>
                <div className="text-white/80">Free Resources</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="text-3xl font-bold">500+</div>
                <div className="text-white/80">Video Lectures</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <div className="text-3xl font-bold">50+</div>
                <div className="text-white/80">Institutions</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-white/80">Access</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onFilterToggle={handleFilterToggle}
            />
          </motion.div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <CategoryFilters
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              isOpen={isMobileFilterOpen}
              onClose={closeMobileFilter}
            />
          </motion.div>

          {/* Featured Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <FeaturedResources />
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Resource Grid - Main Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="lg:col-span-3"
            >
              <ResourceGrid
                searchTerm={searchTerm}
                selectedCategory={selectedCategory}
                bookmarkedItems={bookmarkedItems}
                onBookmark={handleBookmark}
              />
            </motion.div>

            {/* Dashboard Preview - Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
              className="lg:col-span-1"
            >
              <DashboardPreview bookmarkedItems={bookmarkedItems} />
            </motion.div>
          </div>

          {/* Video Lectures Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="mt-12"
          >
            <VideoLectures />
          </motion.div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              🚀 Powerful Learning Features
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover tools and features designed to enhance your learning experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '🔍',
                title: 'Smart Search',
                description: 'Find exactly what you need with our intelligent search that understands context and subjects.'
              },
              {
                icon: '📊',
                title: 'Progress Tracking',
                description: 'Monitor your learning journey with detailed analytics and personalized recommendations.'
              },
              {
                icon: '📱',
                title: 'Mobile Access',
                description: 'Study anywhere, anytime with our fully responsive design and offline capabilities.'
              },
              {
                icon: '🤝',
                title: 'Collaborative Learning',
                description: 'Share resources, create study groups, and learn together with fellow students.'
              },
              {
                icon: '🎓',
                title: 'Certified Content',
                description: 'Access verified educational materials from top universities and institutions globally.'
              },
              {
                icon: '💾',
                title: 'Offline Downloads',
                description: 'Download resources for offline study and access them without an internet connection.'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Accelerate Your Learning? 🚀
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of students who are already using our platform to achieve their academic goals.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200"
              >
                📚 Start Learning Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white/10 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-200"
              >
                📱 Download Mobile App
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}