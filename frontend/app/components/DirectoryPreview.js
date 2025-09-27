'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Filter, MessageCircle, MapPin, Award, ExternalLink } from 'lucide-react';

export default function DirectoryPreview() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [stakeholders, setStakeholders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock JSON data
  const mockStakeholders = [
    {
      id: 1,
      name: 'Dr. Priya Sharma',
      role: 'Govt. Official',
      organization: 'Ministry of Education',
      expertise: 'Policy Development, Higher Education, Student Welfare',
      location: 'New Delhi',
      experience: '15+ years',
      avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
      verified: true,
      specializations: ['Education Policy', 'Student Support', 'Institutional Development']
    },
    {
      id: 2,
      name: 'Prof. Rajesh Kumar',
      role: 'Teacher',
      organization: 'Delhi University',
      expertise: 'Engineering Guidance, Career Counseling, Research Mentorship',
      location: 'Delhi',
      experience: '12+ years',
      avatar: 'https://randomuser.me/api/portraits/men/54.jpg',
      verified: true,
      specializations: ['Engineering', 'Research', 'Technology']
    },
    {
      id: 3,
      name: 'Ms. Anita Patel',
      role: 'NGO Member',
      organization: 'Shiksha Foundation',
      expertise: 'Rural Education, Scholarship Programs, Student Mentorship',
      location: 'Mumbai',
      experience: '8+ years',
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
      verified: true,
      specializations: ['Rural Education', 'Scholarships', 'Community Outreach']
    },
    {
      id: 4,
      name: 'Dr. Vikram Singh',
      role: 'Counselor',
      organization: 'Career Guidance Center',
      expertise: 'Psychological Counseling, Career Assessment, Student Support',
      location: 'Bangalore',
      experience: '10+ years',
      avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
      verified: true,
      specializations: ['Psychology', 'Career Assessment', 'Mental Health']
    },
    {
      id: 5,
      name: 'Mrs. Sunita Reddy',
      role: 'Teacher',
      organization: 'Kendriya Vidyalaya',
      expertise: 'Science Education, STEM Guidance, Exam Preparation',
      location: 'Hyderabad',
      experience: '18+ years',
      avatar: 'https://randomuser.me/api/portraits/women/38.jpg',
      verified: true,
      specializations: ['Science', 'STEM', 'Competitive Exams']
    },
    {
      id: 6,
      name: 'Mr. Arun Mehta',
      role: 'NGO Member',
      organization: 'Digital Education Initiative',
      expertise: 'Digital Literacy, Online Learning, Technology Integration',
      location: 'Pune',
      experience: '6+ years',
      avatar: 'https://randomuser.me/api/portraits/men/29.jpg',
      verified: false,
      specializations: ['Digital Education', 'EdTech', 'Online Learning']
    }
  ];

  // Fetch stakeholders from backend
  useEffect(() => {
    const fetchStakeholders = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/stakeholders?limit=20`);
        const result = await response.json();

        if (result.success) {
          setStakeholders(result.data);
        } else {
          // Fallback to mock data if API fails
          setStakeholders(mockStakeholders);
        }
      } catch (error) {
        console.error('Failed to fetch stakeholders:', error);
        // Fallback to mock data
        setStakeholders(mockStakeholders);
        setError('Unable to fetch latest data. Showing sample data.');
      } finally {
        setLoading(false);
      }
    };

    fetchStakeholders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const roles = ['All', 'Govt. Official', 'Teacher', 'NGO Member', 'Counselor'];

  const filteredStakeholders = stakeholders.filter(stakeholder => {
    const matchesSearch = stakeholder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stakeholder.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stakeholder.expertise.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === '' || selectedRole === 'All' || stakeholder.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role) => {
    switch (role) {
      case 'Govt. Official':
        return 'bg-blue-100 text-blue-800';
      case 'Teacher':
        return 'bg-green-100 text-green-800';
      case 'NGO Member':
        return 'bg-purple-100 text-purple-800';
      case 'Counselor':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Govt. Official':
        return '🏛️';
      case 'Teacher':
        return '👨‍🏫';
      case 'NGO Member':
        return '🤝';
      case 'Counselor':
        return '🎯';
      default:
        return '👤';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
          <Users className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Stakeholder Directory</h2>
          <p className="text-sm text-gray-600">Connect with verified education professionals</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, organization, or expertise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="text-gray-400" size={18} />
          <span className="text-sm font-medium text-gray-700">Filter by role:</span>
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role === 'All' ? '' : role)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                (selectedRole === role || (selectedRole === '' && role === 'All'))
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">⚠️ {error}</p>
        </div>
      )}

      {/* Results count */}
      <p className="text-sm text-gray-600 mb-4">
        {loading ? 'Loading...' : `Showing ${filteredStakeholders.length} of ${stakeholders.length} stakeholders`}
      </p>

      {/* Stakeholder Cards */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {filteredStakeholders.map((stakeholder, index) => (
            <motion.div
              key={stakeholder.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-4 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={stakeholder.avatar}
                    alt={stakeholder.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {stakeholder.verified && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 truncate">{stakeholder.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(stakeholder.role)}`}>
                          {getRoleIcon(stakeholder.role)}
                          {stakeholder.role}
                        </span>
                        {stakeholder.verified && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Award size={12} />
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center gap-2"
                    >
                      <MessageCircle size={14} />
                      Connect
                    </motion.button>
                  </div>

                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <span className="font-medium">Organization:</span>
                      {stakeholder.organization}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <MapPin size={12} />
                      {stakeholder.location} • {stakeholder.experience}
                    </p>
                  </div>

                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-2">Areas of Expertise:</p>
                    <div className="flex flex-wrap gap-1">
                      {stakeholder.specializations.map((spec, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{stakeholder.expertise}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredStakeholders.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <div className="text-4xl mb-2">🔍</div>
            <p className="text-gray-500">No stakeholders found matching your criteria.</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters.</p>
          </motion.div>
        )}
      </div>

      {/* View All Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-6 py-3 border-2 border-purple-200 text-purple-700 font-medium rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 flex items-center justify-center gap-2"
      >
        <ExternalLink size={18} />
        View Full Directory
      </motion.button>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stakeholders.length}</div>
          <div className="text-xs text-blue-600">Total Stakeholders</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{stakeholders.filter(s => s.verified).length}</div>
          <div className="text-xs text-green-600">Verified Members</div>
        </div>
      </div>
    </div>
  );
}