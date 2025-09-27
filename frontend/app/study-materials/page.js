'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Eye, Search, Filter, Star, Calendar, User, Bookmark } from 'lucide-react';

export default function StudyMaterialsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarkedItems, setBookmarkedItems] = useState([1, 3, 7]);

  // Dummy study materials data
  const studyMaterials = [
    {
      id: 1,
      title: 'NCERT Solutions Class 12 Mathematics',
      category: 'Solutions',
      class: '12',
      subject: 'Mathematics',
      type: 'PDF',
      pages: 245,
      size: '15.2 MB',
      downloads: 125430,
      rating: 4.8,
      author: 'NCERT Board',
      uploadDate: '2024-01-15',
      description: 'Complete solutions for all chapters of Class 12 Mathematics NCERT textbook with detailed explanations.',
      topics: ['Calculus', 'Algebra', 'Geometry', 'Statistics', 'Probability'],
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300',
      difficulty: 'Intermediate',
      language: 'English'
    },
    {
      id: 2,
      title: 'JEE Main Physics Formula Sheet',
      category: 'Reference',
      class: '12',
      subject: 'Physics',
      type: 'PDF',
      pages: 25,
      size: '2.8 MB',
      downloads: 89340,
      rating: 4.9,
      author: 'IIT Faculty',
      uploadDate: '2024-01-20',
      description: 'Comprehensive formula sheet covering all physics topics for JEE Main preparation.',
      topics: ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Optics', 'Modern Physics'],
      thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=300',
      difficulty: 'Advanced',
      language: 'English'
    },
    {
      id: 3,
      title: 'Class 10 Science Notes',
      category: 'Notes',
      class: '10',
      subject: 'Science',
      type: 'PDF',
      pages: 180,
      size: '12.4 MB',
      downloads: 156789,
      rating: 4.6,
      author: 'Education Ministry',
      uploadDate: '2024-01-10',
      description: 'Comprehensive science notes covering Physics, Chemistry, and Biology for Class 10 CBSE.',
      topics: ['Light', 'Acids & Bases', 'Life Processes', 'Electricity', 'Carbon Compounds'],
      thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300',
      difficulty: 'Beginner',
      language: 'English'
    },
    {
      id: 4,
      title: 'NEET Biology Quick Revision',
      category: 'Revision',
      class: '12',
      subject: 'Biology',
      type: 'PDF',
      pages: 95,
      size: '8.7 MB',
      downloads: 67890,
      rating: 4.7,
      author: 'Medical Academy',
      uploadDate: '2024-01-25',
      description: 'Quick revision notes for NEET Biology with important diagrams and key points.',
      topics: ['Genetics', 'Ecology', 'Human Physiology', 'Plant Biology', 'Evolution'],
      thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300',
      difficulty: 'Advanced',
      language: 'English'
    },
    {
      id: 5,
      title: 'English Grammar Workbook',
      category: 'Practice',
      class: '11',
      subject: 'English',
      type: 'PDF',
      pages: 120,
      size: '6.5 MB',
      downloads: 98765,
      rating: 4.4,
      author: 'Language Institute',
      uploadDate: '2024-01-12',
      description: 'Comprehensive grammar workbook with exercises and answer keys for Class 11 English.',
      topics: ['Tenses', 'Voice', 'Narration', 'Prepositions', 'Articles'],
      thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300',
      difficulty: 'Intermediate',
      language: 'English'
    },
    {
      id: 6,
      title: 'Computer Science Programming Guide',
      category: 'Guide',
      class: '12',
      subject: 'Computer Science',
      type: 'PDF',
      pages: 200,
      size: '18.9 MB',
      downloads: 54321,
      rating: 4.8,
      author: 'Tech Academy',
      uploadDate: '2024-01-18',
      description: 'Complete programming guide for Class 12 Computer Science with Python examples.',
      topics: ['Python Basics', 'Data Structures', 'File Handling', 'Database', 'Networking'],
      thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=300',
      difficulty: 'Intermediate',
      language: 'English'
    },
    {
      id: 7,
      title: 'History Timeline Charts',
      category: 'Charts',
      class: '10',
      subject: 'History',
      type: 'PDF',
      pages: 45,
      size: '11.2 MB',
      downloads: 76543,
      rating: 4.5,
      author: 'History Department',
      uploadDate: '2024-01-08',
      description: 'Visual timeline charts for major historical events and periods.',
      topics: ['Ancient India', 'Medieval Period', 'Freedom Struggle', 'World Wars', 'Modern India'],
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      difficulty: 'Beginner',
      language: 'English'
    },
    {
      id: 8,
      title: 'Chemistry Lab Manual',
      category: 'Practical',
      class: '11',
      subject: 'Chemistry',
      type: 'PDF',
      pages: 85,
      size: '14.3 MB',
      downloads: 43210,
      rating: 4.6,
      author: 'Science Lab',
      uploadDate: '2024-01-22',
      description: 'Complete laboratory manual with experiments and procedures for Class 11 Chemistry.',
      topics: ['Organic Analysis', 'Inorganic Salts', 'Volumetric Analysis', 'Salt Analysis', 'Practicals'],
      thumbnail: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=300',
      difficulty: 'Intermediate',
      language: 'English'
    }
  ];

  const categories = ['all', 'Notes', 'Solutions', 'Reference', 'Revision', 'Practice', 'Guide', 'Charts', 'Practical'];
  const classes = ['all', '9', '10', '11', '12'];
  const subjects = ['all', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Science', 'Computer Science', 'History'];

  // Filter materials
  const filteredMaterials = studyMaterials.filter(material => {
    const matchesSearch = searchTerm === '' ||
      material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || material.category === selectedCategory;
    const matchesClass = selectedClass === 'all' || material.class === selectedClass;
    const matchesSubject = selectedSubject === 'all' || material.subject === selectedSubject;

    return matchesSearch && matchesCategory && matchesClass && matchesSubject;
  });

  const handleBookmark = (materialId) => {
    setBookmarkedItems(prev => {
      if (prev.includes(materialId)) {
        return prev.filter(id => id !== materialId);
      } else {
        return [...prev, materialId];
      }
    });
  };

  const handleViewMaterial = (material) => {
    alert(`📖 Viewing: ${material.title}\n\nType: ${material.type}\nPages: ${material.pages}\nAuthor: ${material.author}\n\nThis would open the material for viewing.`);
  };

  const handleDownloadMaterial = (material) => {
    alert(`⬇️ Downloading: ${material.title}\n\nSize: ${material.size}\nFormat: ${material.type}\n\nThis would start the download.`);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Notes': 'bg-blue-100 text-blue-700',
      'Solutions': 'bg-green-100 text-green-700',
      'Reference': 'bg-purple-100 text-purple-700',
      'Revision': 'bg-orange-100 text-orange-700',
      'Practice': 'bg-pink-100 text-pink-700',
      'Guide': 'bg-indigo-100 text-indigo-700',
      'Charts': 'bg-teal-100 text-teal-700',
      'Practical': 'bg-red-100 text-red-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
              📄 Study Materials Library
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
              Comprehensive collection of notes, guides, and reference materials for all subjects and classes
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold">{studyMaterials.length}+</div>
                <div className="text-white/80">Study Materials</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{categories.length - 1}</div>
                <div className="text-white/80">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{subjects.length - 1}</div>
                <div className="text-white/80">Subjects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">Free</div>
                <div className="text-white/80">Downloads</div>
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
                  placeholder="Search materials, authors, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                >
                  {classes.map(cls => (
                    <option key={cls} value={cls}>
                      {cls === 'all' ? 'All Classes' : `Class ${cls}`}
                    </option>
                  ))}
                </select>
              </div>

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
            </div>

            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredMaterials.length} of {studyMaterials.length} study materials
            </div>
          </div>

          {/* Materials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map((material, index) => (
              <motion.div
                key={material.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={material.thumbnail}
                    alt={material.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(material.category)}`}>
                      {material.category}
                    </span>
                  </div>

                  {/* Class Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                      Class {material.class}
                    </span>
                  </div>

                  {/* Bookmark Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleBookmark(material.id)}
                    className={`absolute bottom-3 right-3 p-2 rounded-full transition-colors ${
                      bookmarkedItems.includes(material.id)
                        ? 'bg-yellow-500 text-white'
                        : 'bg-black bg-opacity-60 text-white hover:bg-yellow-500'
                    }`}
                  >
                    <Bookmark size={14} fill={bookmarkedItems.includes(material.id) ? 'currentColor' : 'none'} />
                  </motion.button>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{material.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <User size={14} />
                      <span>{material.author}</span>
                      <span>•</span>
                      <span>{material.subject}</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{material.description}</p>
                  </div>

                  {/* Topics */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {material.topics.slice(0, 3).map((topic, topicIndex) => (
                      <span
                        key={topicIndex}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                      >
                        {topic}
                      </span>
                    ))}
                    {material.topics.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                        +{material.topics.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Star size={12} fill="currentColor" className="text-yellow-500" />
                        {material.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download size={12} />
                        {material.downloads.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{material.pages} pages</span>
                      <span>•</span>
                      <span>{material.size}</span>
                    </div>
                  </div>

                  {/* Difficulty Badge */}
                  <div className="mb-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(material.difficulty)}`}>
                      {material.difficulty}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleViewMaterial(material)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <Eye size={14} />
                      View
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDownloadMaterial(material)}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                    >
                      <Download size={14} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* No Results */}
          {filteredMaterials.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No materials found</h3>
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