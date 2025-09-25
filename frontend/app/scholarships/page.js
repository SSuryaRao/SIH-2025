'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, ExternalLink, IndianRupee, Calendar, Users, Book, Award } from 'lucide-react';

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState([]);
  const [filteredScholarships, setFilteredScholarships] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading and set static data
    setTimeout(() => {
      const staticScholarships = [
        {
          id: 1,
          title: "National Scholarship Portal (NSP)",
          provider: "Government of India",
          amount: "₹10,000 - ₹2,00,000",
          deadline: "2024-10-31",
          category: "merit",
          description: "One-stop solution for various scholarship schemes of Central and State Governments including Pre-Matric, Post-Matric, Merit-cum-Means, and Top Class scholarships.",
          eligibility: ["Indian citizens", "Various income criteria", "Academic merit requirements"],
          link: "https://scholarships.gov.in/",
          difficulty: "Medium"
        },
        {
          id: 2,
          title: "INSPIRE Scholarship",
          provider: "Department of Science & Technology",
          amount: "₹80,000 per year + ₹20,000 mentorship",
          deadline: "2024-07-31",
          category: "field-specific",
          description: "Innovation in Science Pursuit for Inspired Research (INSPIRE) scheme for students pursuing science courses at undergraduate and postgraduate levels.",
          eligibility: ["Science stream students", "Top 1% in Class XII", "Age limit: 27 years"],
          link: "https://online-inspire.gov.in/",
          difficulty: "High"
        },
        {
          id: 3,
          title: "Kishore Vaigyanik Protsahan Yojana (KVPY)",
          provider: "Indian Institute of Science",
          amount: "₹5,000 - ₹7,000 per month + Annual Contingency",
          deadline: "2024-09-30",
          category: "field-specific",
          description: "Fellowship program for students with aptitude for research in basic sciences, engineering, and medicine.",
          eligibility: ["Class XI, XII, and UG students", "Science subjects", "Indian citizenship"],
          link: "http://kvpy.iisc.ernet.in/main/index.htm",
          difficulty: "Very High"
        },
        {
          id: 4,
          title: "Central Sector Scheme of Scholarship",
          provider: "Ministry of Education",
          amount: "₹12,000 - ₹20,000 per year",
          deadline: "2024-10-31",
          category: "merit",
          description: "Merit-based scholarship for students from families with annual income less than ₹8 lakh pursuing higher education.",
          eligibility: ["Top 20% in Class XII", "Family income < ₹8 lakh", "Indian citizens"],
          link: "https://scholarships.gov.in/",
          difficulty: "Medium"
        },
        {
          id: 5,
          title: "PM Scholarship Scheme",
          provider: "Ministry of Defence",
          amount: "₹2,500 per month",
          deadline: "2024-12-31",
          category: "diversity",
          description: "Scholarship for wards/widows of Ex-servicemen and serving personnel of Armed Forces and Paramilitary Forces.",
          eligibility: ["Children/widows of armed forces personnel", "Minimum 60% in Class XII", "Age limit varies"],
          link: "https://desw.gov.in/en/scholarship-ex-servicemen",
          difficulty: "Medium"
        },
        {
          id: 6,
          title: "Dr. APJ Abdul Kalam IGNITE Awards",
          provider: "National Innovation Foundation",
          amount: "₹25,000 - ₹5,00,000",
          deadline: "2024-09-30",
          category: "innovation",
          description: "Awards for innovative ideas and projects by students up to Class XII to foster creativity and innovation.",
          eligibility: ["Students up to Class XII", "Original innovative ideas", "Indian citizenship"],
          link: "https://www.nif.org.in/ignite",
          difficulty: "High"
        },
        {
          id: 7,
          title: "Post Matric Scholarship for OBC",
          provider: "Ministry of Social Justice & Empowerment",
          amount: "₹230 - ₹1,200 per month + fees",
          deadline: "2024-11-30",
          category: "diversity",
          description: "Financial assistance to OBC students for pursuing higher education from Class XI onwards.",
          eligibility: ["OBC category students", "Family income < ₹1 lakh", "Class XI onwards"],
          link: "https://scholarships.gov.in/",
          difficulty: "Low"
        },
        {
          id: 8,
          title: "UGC NET JRF Fellowship",
          provider: "University Grants Commission",
          amount: "₹31,000 per month + HRA",
          deadline: "2024-09-15",
          category: "research",
          description: "Junior Research Fellowship for students qualified in UGC NET for pursuing M.Phil/Ph.D programs.",
          eligibility: ["UGC NET qualified", "Age limit: 30 years (35 for women/reserved)", "Research aptitude"],
          link: "https://ugcnet.nta.nic.in/",
          difficulty: "Very High"
        },
        {
          id: 9,
          title: "Sitaram Jindal Foundation Scholarship",
          provider: "Sitaram Jindal Foundation",
          amount: "₹48,000 - ₹1,50,000 per year",
          deadline: "2024-08-31",
          category: "need-based",
          description: "Merit-cum-need based scholarship for academically bright students from economically weaker sections.",
          eligibility: ["Minimum 60% marks", "Family income < ₹5 lakh", "Indian citizens"],
          link: "https://www.sitaramjindalfoundation.org/",
          difficulty: "Medium"
        },
        {
          id: 10,
          title: "Tata Scholarship",
          provider: "Tata Education and Development Trust",
          amount: "₹2,00,000 - ₹6,00,000 per year",
          deadline: "2024-05-31",
          category: "merit",
          description: "Scholarships for Indian students pursuing undergraduate studies at leading universities.",
          eligibility: ["Admitted to top universities", "Excellent academic record", "Leadership potential"],
          link: "https://www.tatatrusts.org/our-work/individual-grants-programme/education",
          difficulty: "Very High"
        },
        {
          id: 11,
          title: "Google India Scholarship",
          provider: "Google India",
          amount: "₹40,000 - ₹1,00,000",
          deadline: "2024-03-31",
          category: "field-specific",
          description: "Scholarships for students from underrepresented groups pursuing computer science and technology education.",
          eligibility: ["Computer Science students", "Underrepresented groups", "Strong academic record"],
          link: "https://buildyourfuture.withgoogle.com/scholarships/",
          difficulty: "High"
        },
        {
          id: 12,
          title: "Aditya Birla Scholarship",
          provider: "Aditya Birla Group",
          amount: "₹1,50,000 per year",
          deadline: "2024-07-15",
          category: "merit",
          description: "Merit-based scholarship for students pursuing professional courses at premier institutions.",
          eligibility: ["Top-tier college admission", "Excellent academic performance", "Leadership qualities"],
          link: "https://scholarships.adityabirla.com/",
          difficulty: "Very High"
        }
      ];
      setScholarships(staticScholarships);
      setFilteredScholarships(staticScholarships);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredScholarships(scholarships);
    } else {
      setFilteredScholarships(scholarships.filter(scholarship => scholarship.category === selectedCategory));
    }
  }, [selectedCategory, scholarships]);

  const categories = [
    { id: 'all', label: 'All Scholarships', icon: Award },
    { id: 'merit', label: 'Merit-Based', icon: GraduationCap },
    { id: 'need-based', label: 'Need-Based', icon: IndianRupee },
    { id: 'field-specific', label: 'Field-Specific', icon: Book },
    { id: 'diversity', label: 'Diversity', icon: Users },
    { id: 'research', label: 'Research', icon: Book },
    { id: 'innovation', label: 'Innovation', icon: Award }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Very High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDeadline = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-lg font-medium text-gray-700">Loading scholarships...</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            🎓 Scholarship Opportunities
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover funding opportunities to support your educational journey. From merit-based awards to need-based grants, find the perfect scholarship for you.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-medium ${
                    selectedCategory === category.id
                      ? 'bg-indigo-600 text-white shadow-lg transform scale-105'
                      : 'bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 shadow-md hover:shadow-lg'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm">{category.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Scholarships Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScholarships.map((scholarship, index) => (
            <motion.div
              key={scholarship.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-indigo-300 transform hover:-translate-y-1"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {scholarship.title}
                    </h3>
                    <p className="text-sm text-indigo-600 font-medium">
                      {scholarship.provider}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(scholarship.difficulty)}`}>
                    {scholarship.difficulty}
                  </div>
                </div>

                {/* Amount and Deadline */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {/* <IndianRupee className="w-4 h-4 text-green-600" /> */}
                    <span className="text-sm font-semibold text-green-600">
                      {scholarship.amount}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-600 font-medium">
                      {formatDeadline(scholarship.deadline)}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {scholarship.description}
                </p>

                {/* Eligibility */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Eligibility:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {scholarship.eligibility.slice(0, 3).map((req, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <a
                  href={scholarship.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span>Apply Now</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredScholarships.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white shadow-lg rounded-xl p-12 text-center border border-gray-200 mt-8"
          >
            <GraduationCap className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No scholarships found</h3>
            <p className="text-gray-600">
              Try selecting a different category or check back later for more opportunities.
            </p>
          </motion.div>
        )}

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Tips for Scholarship Success</h2>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8" />
                </div>
                <h3 className="font-semibold mb-2">Start Early</h3>
                <p className="text-sm opacity-90">Begin your scholarship search and applications well before deadlines.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Book className="w-8 h-8" />
                </div>
                <h3 className="font-semibold mb-2">Meet Requirements</h3>
                <p className="text-sm opacity-90">Carefully read and ensure you meet all eligibility criteria before applying.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="font-semibold mb-2">Stand Out</h3>
                <p className="text-sm opacity-90">Highlight your unique experiences, achievements, and goals in your application.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}