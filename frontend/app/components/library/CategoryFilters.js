'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Trophy, Target, GraduationCap, X } from 'lucide-react';

export default function CategoryFilters({
  selectedCategory,
  setSelectedCategory,
  isOpen,
  onClose
}) {
  const categories = [
    {
      id: 'all',
      name: 'All Resources',
      icon: Book,
      color: 'bg-gray-100 text-gray-700',
      activeColor: 'bg-gray-600 text-white',
      description: 'Browse all available resources'
    },
    {
      id: 'academic',
      name: 'Academic',
      icon: GraduationCap,
      color: 'bg-blue-100 text-blue-700',
      activeColor: 'bg-blue-600 text-white',
      description: 'School and college subjects'
    },
    {
      id: 'competitive',
      name: 'Competitive Exams',
      icon: Trophy,
      color: 'bg-green-100 text-green-700',
      activeColor: 'bg-green-600 text-white',
      description: 'JEE, NEET, UPSC, and more'
    },
    {
      id: 'skills',
      name: 'Skill Development',
      icon: Target,
      color: 'bg-purple-100 text-purple-700',
      activeColor: 'bg-purple-600 text-white',
      description: 'Programming, design, soft skills'
    },
    {
      id: 'scholarships',
      name: 'Scholarships',
      icon: GraduationCap,
      color: 'bg-orange-100 text-orange-700',
      activeColor: 'bg-orange-600 text-white',
      description: 'Funding and scholarship guides'
    }
  ];

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    if (onClose) onClose(); // Close mobile filter on selection
  };

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden md:block bg-white rounded-xl shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>📚</span>
          Categories
        </h3>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;

            return (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCategorySelect(category.id)}
                className={`p-4 rounded-xl transition-all duration-200 text-left group ${
                  isActive ? category.activeColor : category.color
                } hover:shadow-md`}
                title={category.description}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Icon size={20} />
                  <span className="font-medium text-sm">{category.name}</span>
                </div>
                <p className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                  {category.description}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={onClose}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <span>📚</span>
                    Categories
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <X size={20} />
                  </motion.button>
                </div>

                {/* Category List */}
                <div className="space-y-3">
                  {categories.map((category, index) => {
                    const Icon = category.icon;
                    const isActive = selectedCategory === category.id;

                    return (
                      <motion.button
                        key={category.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleCategorySelect(category.id)}
                        className={`w-full p-4 rounded-xl transition-all duration-200 text-left ${
                          isActive ? category.activeColor : category.color
                        } hover:shadow-md`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Icon size={20} />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <p className={`text-sm ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                          {category.description}
                        </p>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Stats */}
                <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">📊 Quick Stats</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-blue-600">1,247</div>
                      <div className="text-gray-600">Total Resources</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-green-600">324</div>
                      <div className="text-gray-600">Free Resources</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}