'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, MapPin, Briefcase, Star, Award, Building, Calendar, Users } from 'lucide-react';

export default function AlumniPage() {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading and set static data
    setTimeout(() => {
      const staticStories = [
        {
          id: 1,
          name: "Priya Sharma",
          image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
          role: "Senior Software Engineer",
          company: "Google",
          location: "Bengaluru, India",
          graduationYear: "2019",
          course: "B.Tech Computer Science",
          category: "technology",
          story: "After completing my B.Tech through this platform's guidance, I landed my dream job at Google. The career counseling and technical preparation resources were invaluable in my journey.",
          achievements: ["Led 3 major product launches", "Mentored 15+ junior engineers", "Published 5 research papers"],
          currentSalary: "₹45 LPA",
          rating: 5
        },
        {
          id: 2,
          name: "Rajesh Kumar",
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
          role: "Investment Banking Associate",
          company: "Goldman Sachs",
          location: "Mumbai, India",
          graduationYear: "2020",
          course: "MBA Finance",
          category: "finance",
          story: "The platform helped me transition from engineering to finance. The personalized recommendations and mentor guidance were crucial for my MBA preparation and career switch.",
          achievements: ["Managed ₹500Cr+ portfolios", "Top performer 2 years running", "CFA Level 2 cleared"],
          currentSalary: "₹35 LPA",
          rating: 5
        },
        {
          id: 3,
          name: "Dr. Anita Patel",
          image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
          role: "Cardiologist",
          company: "All India Institute of Medical Sciences",
          location: "New Delhi, India",
          graduationYear: "2018",
          course: "MBBS + MD Cardiology",
          category: "healthcare",
          story: "From a small town to AIIMS, this platform's scholarship information and medical entrance guidance made my dream possible. Today, I've performed 200+ successful surgeries.",
          achievements: ["200+ successful surgeries", "Published 12 medical papers", "Featured in Medical Today"],
          currentSalary: "₹25 LPA",
          rating: 5
        },
        {
          id: 4,
          name: "Arjun Mehta",
          image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
          role: "Founder & CEO",
          company: "EcoTech Solutions",
          location: "Pune, India",
          graduationYear: "2017",
          course: "B.Tech Environmental Engineering",
          category: "entrepreneurship",
          story: "The entrepreneurship resources and startup guidance helped me build a sustainable technology company. We've now raised ₹50Cr in funding and employ 100+ people.",
          achievements: ["₹50Cr funding raised", "100+ employees", "3 patents filed"],
          currentSalary: "Equity worth ₹200Cr+",
          rating: 5
        },
        {
          id: 5,
          name: "Sneha Reddy",
          image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
          role: "Civil Service Officer (IAS)",
          company: "Government of Telangana",
          location: "Hyderabad, India",
          graduationYear: "2019",
          course: "B.A Political Science + UPSC",
          category: "government",
          story: "The platform's UPSC preparation resources and current affairs updates were instrumental in cracking the civil services exam in my second attempt. Now serving as District Collector.",
          achievements: ["All India Rank 42 in UPSC", "Implemented 5 key policies", "Featured in The Hindu"],
          currentSalary: "₹12 LPA + Benefits",
          rating: 5
        },
        {
          id: 6,
          name: "Vikram Singh",
          image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
          role: "Research Scientist",
          company: "Indian Space Research Organisation",
          location: "Bengaluru, India",
          graduationYear: "2018",
          course: "M.Tech Aerospace Engineering",
          category: "research",
          story: "Thanks to the research opportunities and fellowship information provided by the platform, I'm now part of India's space program. Currently working on the Chandrayaan-4 mission.",
          achievements: ["Part of Chandrayaan-3 team", "15+ research publications", "Young Scientist Award 2023"],
          currentSalary: "₹18 LPA",
          rating: 5
        },
        {
          id: 7,
          name: "Meera Joshi",
          image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face",
          role: "Creative Director",
          company: "Ogilvy India",
          location: "Mumbai, India",
          graduationYear: "2020",
          course: "Master in Design",
          category: "creative",
          story: "The creative portfolio guidance and industry connections helped me break into advertising. My campaigns have won 3 Cannes Lions and reached millions of people.",
          achievements: ["3 Cannes Lions Awards", "Campaign of the Year 2023", "40M+ reach on campaigns"],
          currentSalary: "₹22 LPA",
          rating: 4
        },
        {
          id: 8,
          name: "Karthik Nair",
          image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=400&h=400&fit=crop&crop=face",
          role: "Data Science Manager",
          company: "Flipkart",
          location: "Bengaluru, India",
          graduationYear: "2019",
          course: "M.Sc Statistics + Data Science Bootcamp",
          category: "technology",
          story: "The platform's AI/ML course recommendations and project guidance helped me transition from statistics to data science. Now leading a team of 12 data scientists.",
          achievements: ["Led 5+ ML projects", "Team of 12 scientists", "ML Innovation Award 2022"],
          currentSalary: "₹32 LPA",
          rating: 5
        },
        {
          id: 9,
          name: "Deepika Agarwal",
          image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
          role: "Senior Consultant",
          company: "McKinsey & Company",
          location: "Mumbai, India",
          graduationYear: "2020",
          course: "MBA Strategy",
          category: "consulting",
          story: "The case study practice and consulting prep resources were game-changers. I've advised Fortune 500 companies on digital transformation worth ₹1000Cr+.",
          achievements: ["₹1000Cr+ projects advised", "Top 10% performer", "Client Choice Award 2023"],
          currentSalary: "₹40 LPA",
          rating: 5
        },
        {
          id: 10,
          name: "Rohit Gupta",
          image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
          role: "Senior Architect",
          company: "Zaha Hadid Architects",
          location: "London, UK",
          graduationYear: "2018",
          course: "M.Arch Architecture",
          category: "design",
          story: "The international scholarship guidance helped me study abroad. Now working on iconic buildings worldwide, including a ₹500Cr project in Dubai.",
          achievements: ["5 international projects", "RIBA Award winner", "Featured in Architectural Digest"],
          currentSalary: "£85,000 (₹85 LPA)",
          rating: 5
        }
      ];
      setStories(staticStories);
      setFilteredStories(staticStories);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredStories(stories);
    } else {
      setFilteredStories(stories.filter(story => story.category === selectedCategory));
    }
  }, [selectedCategory, stories]);

  const categories = [
    { id: 'all', label: 'All Stories', icon: Users },
    { id: 'technology', label: 'Technology', icon: Building },
    { id: 'finance', label: 'Finance', icon: Briefcase },
    { id: 'healthcare', label: 'Healthcare', icon: Award },
    { id: 'entrepreneurship', label: 'Startups', icon: Star },
    { id: 'government', label: 'Government', icon: Building },
    { id: 'research', label: 'Research', icon: GraduationCap },
    { id: 'creative', label: 'Creative', icon: Award },
    { id: 'consulting', label: 'Consulting', icon: Briefcase },
    { id: 'design', label: 'Design', icon: Award }
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
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
          <div className="text-lg font-medium text-gray-700">Loading alumni stories...</div>
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
            🌟 Alumni Success Stories
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover inspiring journeys of our alumni who transformed their careers with our guidance platform. From startups to Fortune 500 companies, see where our guidance can take you.
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

        {/* Alumni Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-indigo-300 transform hover:-translate-y-1"
            >
              <div className="p-6">
                {/* Profile Header */}
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-4 border-indigo-100">
                    <img
                      src={story.image}
                      alt={story.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {story.name}
                    </h3>
                    <p className="text-sm text-indigo-600 font-medium mb-1">
                      {story.role}
                    </p>
                    <div className="flex items-center gap-2">
                      <Building className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-600">{story.company}</span>
                    </div>
                  </div>
                </div>

                {/* Location and Graduation */}
                <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{story.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Class of {story.graduationYear}</span>
                  </div>
                </div>

                {/* Course */}
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-medium text-gray-800">{story.course}</span>
                  </div>
                </div>

                {/* Story */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {story.story}
                </p>

                {/* Achievements */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Achievements:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {story.achievements.slice(0, 3).map((achievement, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Salary and Rating */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm">
                    <span className="text-gray-500">Current Package:</span>
                    <span className="font-semibold text-green-600 ml-1">
                      {story.currentSalary}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(story.rating)}
                  </div>
                </div>

                {/* Connect Button */}
                <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                  Connect with {story.name.split(' ')[0]}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredStories.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white shadow-lg rounded-xl p-12 text-center border border-gray-200 mt-8"
          >
            <Users className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No stories found</h3>
            <p className="text-gray-600">
              Try selecting a different category or check back later for more inspiring stories.
            </p>
          </motion.div>
        )}

        {/* Success Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Our Alumni Success by Numbers</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">2500+</div>
              <div className="text-sm opacity-90">Success Stories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">₹28 LPA</div>
              <div className="text-sm opacity-90">Average Package</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">85%</div>
              <div className="text-sm opacity-90">Placement Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">150+</div>
              <div className="text-sm opacity-90">Top Companies</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}