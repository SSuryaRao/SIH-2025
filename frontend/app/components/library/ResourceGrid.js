'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Bookmark, ExternalLink, Eye, FileText, Video, Image as ImageIcon, Archive } from 'lucide-react';

export default function ResourceGrid({
  searchTerm,
  selectedCategory,
  bookmarkedItems,
  onBookmark
}) {
  const [visibleItems, setVisibleItems] = useState(12);

  // Mock resources data
  const mockResources = [
    {
      id: 1,
      title: 'Complete JEE Main Mathematics',
      category: 'competitive',
      author: 'IIT Faculty',
      description: 'Comprehensive mathematics guide for JEE Main preparation with solved examples and practice questions.',
      type: 'PDF',
      size: '15.2 MB',
      downloads: 45672,
      rating: 4.8,
      tags: ['Mathematics', 'JEE', 'Engineering'],
      dateAdded: '2024-01-15',
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300'
    },
    {
      id: 2,
      title: 'Python Programming Fundamentals',
      category: 'skills',
      author: 'Tech Academy',
      description: 'Learn Python from basics to advanced concepts with hands-on projects and real-world examples.',
      type: 'Video',
      size: '2.1 GB',
      downloads: 89234,
      rating: 4.9,
      tags: ['Programming', 'Python', 'Software Development'],
      dateAdded: '2024-01-20',
      thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=300'
    },
    {
      id: 3,
      title: 'Class 12 Physics NCERT Solutions',
      category: 'academic',
      author: 'NCERT Board',
      description: 'Complete solutions for Class 12 Physics textbook with detailed explanations and diagrams.',
      type: 'PDF',
      size: '8.7 MB',
      downloads: 234567,
      rating: 4.7,
      tags: ['Physics', 'NCERT', 'Class 12'],
      dateAdded: '2024-01-10',
      thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=300'
    },
    {
      id: 4,
      title: 'Government Scholarship Guide 2024',
      category: 'scholarships',
      author: 'Education Ministry',
      description: 'Complete guide to all government scholarships available for students in 2024.',
      type: 'PDF',
      size: '12.4 MB',
      downloads: 67890,
      rating: 4.6,
      tags: ['Scholarships', 'Government', 'Financial Aid'],
      dateAdded: '2024-01-25',
      thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300'
    },
    {
      id: 5,
      title: 'Web Development Bootcamp',
      category: 'skills',
      author: 'CodeCamp',
      description: 'Full-stack web development course covering HTML, CSS, JavaScript, React, and Node.js.',
      type: 'Video',
      size: '5.8 GB',
      downloads: 123456,
      rating: 4.8,
      tags: ['Web Development', 'JavaScript', 'React'],
      dateAdded: '2024-01-18',
      thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300'
    },
    {
      id: 6,
      title: 'NEET Biology Notes',
      category: 'competitive',
      author: 'Medical Academy',
      description: 'Comprehensive biology notes for NEET preparation with diagrams and practice questions.',
      type: 'PDF',
      size: '25.6 MB',
      downloads: 78901,
      rating: 4.7,
      tags: ['Biology', 'NEET', 'Medical'],
      dateAdded: '2024-01-12',
      thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300'
    },
    {
      id: 7,
      title: 'English Grammar Masterclass',
      category: 'academic',
      author: 'Language Institute',
      description: 'Master English grammar with interactive exercises and real-world examples.',
      type: 'Interactive',
      size: '156 MB',
      downloads: 345678,
      rating: 4.5,
      tags: ['English', 'Grammar', 'Language'],
      dateAdded: '2024-01-08',
      thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300'
    },
    {
      id: 8,
      title: 'Digital Marketing Course',
      category: 'skills',
      author: 'Marketing Pro',
      description: 'Learn digital marketing strategies including SEO, social media, and content marketing.',
      type: 'Video',
      size: '3.2 GB',
      downloads: 56789,
      rating: 4.6,
      tags: ['Marketing', 'Digital', 'Business'],
      dateAdded: '2024-01-22',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300'
    }
  ];

  // Filter resources based on search and category
  const filteredResources = mockResources.filter(resource => {
    const matchesSearch = searchTerm === '' ||
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const visibleResources = filteredResources.slice(0, visibleItems);

  const getFileIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'pdf': return <FileText className="text-red-500" size={16} />;
      case 'video': return <Video className="text-blue-500" size={16} />;
      case 'interactive': return <ImageIcon className="text-green-500" size={16} />;
      default: return <Archive className="text-gray-500" size={16} />;
    }
  };

  const handleViewResource = (resource) => {
    alert(`📖 Opening: ${resource.title}\n\nThis would open the resource for viewing.`);
  };

  const handleDownloadResource = (resource) => {
    alert(`⬇️ Downloading: ${resource.title}\n\nFile size: ${resource.size}\nThis would start the download.`);
  };

  const loadMore = () => {
    setVisibleItems(prev => Math.min(prev + 12, filteredResources.length));
  };

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {searchTerm ? `Search Results for "${searchTerm}"` : 'All Resources'}
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            Showing {visibleResources.length} of {filteredResources.length} resources
          </p>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>Most Popular</option>
            <option>Recently Added</option>
            <option>Highest Rated</option>
            <option>A-Z</option>
          </select>
        </div>
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {visibleResources.map((resource, index) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              {/* Thumbnail */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={resource.thumbnail}
                  alt={resource.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-black bg-opacity-60 text-white text-xs rounded-full">
                  {getFileIcon(resource.type)}
                  {resource.type}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onBookmark(resource.id)}
                  className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
                    bookmarkedItems.includes(resource.id)
                      ? 'bg-yellow-500 text-white'
                      : 'bg-black bg-opacity-60 text-white hover:bg-yellow-500'
                  }`}
                  title="Bookmark"
                >
                  <Bookmark size={14} fill={bookmarkedItems.includes(resource.id) ? 'currentColor' : 'none'} />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="mb-3">
                  <h4 className="font-bold text-gray-900 mb-1 line-clamp-2">{resource.title}</h4>
                  <p className="text-sm text-blue-600 mb-2">by {resource.author}</p>
                  <p className="text-sm text-gray-600 line-clamp-2">{resource.description}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {resource.tags.slice(0, 2).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                  {resource.tags.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                      +{resource.tags.length - 2}
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>⭐ {resource.rating}</span>
                  <span>📥 {resource.downloads.toLocaleString()}</span>
                  <span>📁 {resource.size}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleViewResource(resource)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Eye size={14} />
                    View
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDownloadResource(resource)}
                    className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    title="Download"
                  >
                    <Download size={14} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Load More Button */}
      {visibleItems < filteredResources.length && (
        <div className="flex justify-center mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadMore}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium flex items-center gap-2"
          >
            Load More Resources
            <span className="text-sm opacity-80">
              ({filteredResources.length - visibleItems} remaining)
            </span>
          </motion.button>
        </div>
      )}

      {/* No Results */}
      {filteredResources.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No resources found</h3>
          <p className="text-gray-600">
            Try adjusting your search terms or category filters.
          </p>
        </motion.div>
      )}
    </div>
  );
}