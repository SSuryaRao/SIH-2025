'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Download, Star, Users, Clock } from 'lucide-react';

export default function FeaturedResources() {
  const featuredResources = [
    {
      id: 1,
      title: 'NCERT Textbooks',
      description: 'Complete collection of NCERT books for all classes and subjects',
      source: 'Government of India',
      category: 'Academic',
      type: 'Open Source',
      rating: 4.9,
      users: '2.5M+',
      lastUpdated: '2024',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
      tags: ['Free', 'Government', 'Curriculum']
    },
    {
      id: 2,
      title: 'SWAYAM Courses',
      description: 'Online courses by top Indian universities and institutions',
      source: 'Ministry of Education',
      category: 'Skill Development',
      type: 'Open Source',
      rating: 4.7,
      users: '1.8M+',
      lastUpdated: '2024',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400',
      tags: ['Free', 'Certified', 'University']
    },
    {
      id: 3,
      title: 'NPTEL Lectures',
      description: 'Technical education videos by IIT/IISc professors',
      source: 'IIT/IISc Consortium',
      category: 'Academic',
      type: 'Open Source',
      rating: 4.8,
      users: '3.2M+',
      lastUpdated: '2024',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
      tags: ['Free', 'IIT', 'Technical']
    },
    {
      id: 4,
      title: 'Khan Academy',
      description: 'World-class education for anyone, anywhere',
      source: 'Khan Academy',
      category: 'Academic',
      type: 'Open Source',
      rating: 4.6,
      users: '5M+',
      lastUpdated: '2024',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400',
      tags: ['Free', 'Interactive', 'Global']
    },
    {
      id: 5,
      title: 'MIT OpenCourseWare',
      description: 'Free courses from Massachusetts Institute of Technology',
      source: 'MIT',
      category: 'Academic',
      type: 'Open Source',
      rating: 4.9,
      users: '1.2M+',
      lastUpdated: '2024',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      tags: ['Free', 'MIT', 'Advanced']
    }
  ];

  const handleViewResource = (resource) => {
    alert(`🔗 Opening ${resource.title}\n\nThis would redirect to: ${resource.source}`);
  };

  const handleDownload = (resource) => {
    alert(`⬇️ Downloading ${resource.title}\n\nThis would start the download process.`);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>⭐</span>
            Featured Open-Source Resources
          </h2>
          <p className="text-gray-600 mt-1">Curated high-quality educational content from trusted sources</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          View All →
        </motion.button>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-6" style={{ width: 'max-content' }}>
          {featuredResources.map((resource, index) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
              style={{ width: '320px', minWidth: '320px' }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={resource.image}
                  alt={resource.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                    {resource.type}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 bg-black bg-opacity-50 text-white text-xs font-medium rounded-full flex items-center gap-1">
                    <Star size={12} fill="currentColor" />
                    {resource.rating}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{resource.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                  <p className="text-xs text-blue-600 font-medium">{resource.source}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {resource.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Users size={12} />
                    {resource.users}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {resource.lastUpdated}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleViewResource(resource)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <ExternalLink size={14} />
                    View
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDownload(resource)}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    title="Download"
                  >
                    <Download size={14} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Navigation Hint */}
      <div className="flex items-center justify-center mt-4">
        <p className="text-xs text-gray-500 flex items-center gap-2">
          <span>👈</span>
          Scroll horizontally to see more resources
          <span>👉</span>
        </p>
      </div>
    </div>
  );
}