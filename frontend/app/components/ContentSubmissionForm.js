'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, CheckCircle, Type, Tag } from 'lucide-react';

export default function ContentSubmissionForm() {
  const [formData, setFormData] = useState({
    title: '',
    contentType: '',
    details: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const contentTypes = [
    'Scholarship',
    'Exam Update',
    'Career Guidance',
    'Success Story'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const formDataToSend = new FormData();

      // Append form fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      // Append file if selected
      if (selectedFile) {
        formDataToSend.append('file', selectedFile);
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/stakeholders/content`, {
        method: 'POST',
        body: formDataToSend
      });

      const result = await response.json();

      if (result.success) {
        setShowSuccess(true);
        // Reset form
        setFormData({
          title: '',
          contentType: '',
          details: ''
        });
        setSelectedFile(null);

        // Hide success message after 5 seconds
        setTimeout(() => setShowSuccess(false), 5000);
      } else {
        setError(result.message || 'Content submission failed. Please try again.');
      }

    } catch (error) {
      console.error('Content submission error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getContentTypeIcon = (type) => {
    switch (type) {
      case 'Scholarship':
        return '🎓';
      case 'Exam Update':
        return '📝';
      case 'Career Guidance':
        return '💼';
      case 'Success Story':
        return '⭐';
      default:
        return '📄';
    }
  };

  const getContentTypeDescription = (type) => {
    switch (type) {
      case 'Scholarship':
        return 'Share scholarship opportunities and financial aid information';
      case 'Exam Update':
        return 'Post important exam dates, registration deadlines, and updates';
      case 'Career Guidance':
        return 'Provide career advice, industry insights, and guidance';
      case 'Success Story':
        return 'Share inspiring success stories and achievements';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
          <FileText className="text-white" size={24} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Content Submission</h2>
      </div>

      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
        >
          <CheckCircle className="text-green-600" size={20} />
          <span className="text-green-800">Content submitted successfully! It will be reviewed and published soon.</span>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
        >
          <span className="text-red-600">⚠️</span>
          <span className="text-red-800">{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Content Title *
          </label>
          <div className="relative">
            <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter a descriptive title for your content"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-gray-900"
            />
          </div>
        </div>

        {/* Content Type */}
        <div>
          <label htmlFor="contentType" className="block text-sm font-medium text-gray-700 mb-2">
            Content Type *
          </label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              id="contentType"
              name="contentType"
              value={formData.contentType}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 appearance-none text-gray-900"
            >
              <option value="">Select content type</option>
              {contentTypes.map((type) => (
                <option key={type} value={type}>
                  {getContentTypeIcon(type)} {type}
                </option>
              ))}
            </select>
          </div>
          {formData.contentType && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-gray-600 mt-2 ml-10"
            >
              {getContentTypeDescription(formData.contentType)}
            </motion.p>
          )}
        </div>

        {/* Details */}
        <div>
          <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-2">
            Content Details *
          </label>
          <textarea
            id="details"
            name="details"
            value={formData.details}
            onChange={handleChange}
            required
            rows={6}
            placeholder="Provide detailed information about your content. Include relevant dates, requirements, eligibility criteria, or any other important details..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none text-gray-900"
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.details.length}/1000 characters
          </p>
        </div>

        {/* Upload File */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Supporting File (Optional)
          </label>
          <div className="relative">
            <input
              type="file"
              id="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all duration-200 cursor-pointer"
            >
              <Upload className="text-gray-400" size={20} />
              <span className="text-gray-600">
                {selectedFile ? selectedFile.name : 'Click to upload documents, images, or files'}
              </span>
            </motion.div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Supported formats: PDF, DOC, DOCX, JPG, PNG (max 10MB)</p>
          {selectedFile && (
            <p className="text-xs text-green-600 mt-1">✓ File selected: {selectedFile.name}</p>
          )}
        </div>

        {/* Content Preview Section */}
        {(formData.title || formData.contentType || formData.details) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 rounded-lg p-4 border border-gray-200"
          >
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span>📋</span>
              Content Preview
            </h3>
            <div className="space-y-2">
              {formData.title && (
                <div>
                  <span className="text-xs font-medium text-gray-500">Title:</span>
                  <p className="text-sm text-gray-700">{formData.title}</p>
                </div>
              )}
              {formData.contentType && (
                <div>
                  <span className="text-xs font-medium text-gray-500">Type:</span>
                  <p className="text-sm text-gray-700">
                    {getContentTypeIcon(formData.contentType)} {formData.contentType}
                  </p>
                </div>
              )}
              {formData.details && (
                <div>
                  <span className="text-xs font-medium text-gray-500">Details:</span>
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {formData.details.substring(0, 150)}
                    {formData.details.length > 150 ? '...' : ''}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-green-700 hover:to-emerald-700 focus:ring-4 focus:ring-green-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Submitting Content...
            </div>
          ) : (
            'Submit Content'
          )}
        </motion.button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">📝 Submission Guidelines</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Ensure all information is accurate and up-to-date</li>
          <li>• Content will be reviewed before publication</li>
          <li>• Include specific dates, deadlines, and requirements</li>
          <li>• Use clear, student-friendly language</li>
        </ul>
      </div>
    </div>
  );
}