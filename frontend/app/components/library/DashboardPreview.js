'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Download, Clock, TrendingUp, Eye, FileText } from 'lucide-react';

export default function DashboardPreview({ bookmarkedItems }) {
  // Mock recent activity data
  const recentActivity = [
    {
      id: 1,
      action: 'downloaded',
      resource: 'JEE Main Mathematics',
      time: '2 hours ago',
      icon: Download
    },
    {
      id: 2,
      action: 'bookmarked',
      resource: 'Python Programming Guide',
      time: '5 hours ago',
      icon: Bookmark
    },
    {
      id: 3,
      action: 'viewed',
      resource: 'Class 12 Physics NCERT',
      time: '1 day ago',
      icon: Eye
    }
  ];

  // Mock saved materials
  const savedMaterials = [
    {
      id: 1,
      title: 'Complete JEE Main Mathematics',
      type: 'PDF',
      size: '15.2 MB',
      savedDate: '2024-01-15'
    },
    {
      id: 2,
      title: 'Python Programming Fundamentals',
      type: 'Video',
      size: '2.1 GB',
      savedDate: '2024-01-20'
    },
    {
      id: 3,
      title: 'NEET Biology Notes',
      type: 'PDF',
      size: '25.6 MB',
      savedDate: '2024-01-12'
    },
    {
      id: 4,
      title: 'Web Development Bootcamp',
      type: 'Video',
      size: '5.8 GB',
      savedDate: '2024-01-18'
    }
  ];

  // Mock statistics
  const stats = {
    totalBookmarked: bookmarkedItems.length || savedMaterials.length,
    totalDownloaded: 23,
    hoursStudied: 47,
    completedCourses: 3
  };

  const handleViewSavedMaterial = (material) => {
    alert(`📖 Opening saved material: ${material.title}`);
  };

  const handleRemoveBookmark = (materialId) => {
    alert(`🗑️ Removing bookmark for material ID: ${materialId}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
          <Bookmark className="text-white" size={20} />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">My Library</h3>
          <p className="text-xs text-gray-600">Saved Materials & Progress</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg text-center"
        >
          <div className="text-lg font-bold text-blue-600">{stats.totalBookmarked}</div>
          <div className="text-xs text-blue-600">Bookmarked</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg text-center"
        >
          <div className="text-lg font-bold text-green-600">{stats.totalDownloaded}</div>
          <div className="text-xs text-green-600">Downloaded</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg text-center"
        >
          <div className="text-lg font-bold text-purple-600">{stats.hoursStudied}h</div>
          <div className="text-xs text-purple-600">Study Time</div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded-lg text-center"
        >
          <div className="text-lg font-bold text-orange-600">{stats.completedCourses}</div>
          <div className="text-xs text-orange-600">Completed</div>
        </motion.div>
      </div>

      {/* Saved Materials */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
            <Bookmark size={16} className="text-yellow-500" />
            Saved Materials
          </h4>
          <span className="text-xs text-gray-500">{savedMaterials.length} items</span>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto">
          {savedMaterials.slice(0, 4).map((material, index) => (
            <motion.div
              key={material.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer group"
              onClick={() => handleViewSavedMaterial(material)}
            >
              <div className="p-1 bg-blue-100 rounded">
                <FileText size={12} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-gray-900 truncate">
                  {material.title}
                </div>
                <div className="text-xs text-gray-500">
                  {material.type} • {material.size}
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveBookmark(material.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all duration-200"
                title="Remove bookmark"
              >
                ×
              </motion.button>
            </motion.div>
          ))}
        </div>

        {savedMaterials.length > 4 && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-2 py-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            View All ({savedMaterials.length - 4} more)
          </motion.button>
        )}
      </div>

      {/* Recent Activity */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2 mb-3">
          <Clock size={16} className="text-blue-500" />
          Recent Activity
        </h4>

        <div className="space-y-2">
          {recentActivity.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 text-xs"
              >
                <div className="p-1 bg-gray-100 rounded">
                  <Icon size={10} className="text-gray-600" />
                </div>
                <div className="flex-1">
                  <span className="text-gray-900">
                    {activity.action} <span className="font-medium">{activity.resource}</span>
                  </span>
                  <div className="text-gray-500">{activity.time}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-900">Weekly Goal</span>
          <span className="text-xs text-gray-600">6/10 resources</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '60%' }}
            transition={{ duration: 1, delay: 0.5 }}
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          4 more resources to reach your weekly goal! 🎯
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 space-y-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-sm font-medium"
        >
          📊 View Full Dashboard
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 text-sm font-medium"
        >
          📥 Download All Saved
        </motion.button>
      </div>
    </div>
  );
}