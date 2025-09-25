'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    if (!mounted) return; // Prevent issues during hydration

    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest('.navbar-dropdown')) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdown, mounted]);

  // Prevent hydration mismatch
  if (!mounted) return null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false);
    router.push('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Organized navigation structure with dropdowns
  const navStructure = {
    main: [
      { href: '/dashboard', label: 'Dashboard' },
      {
        label: 'Discover',
        dropdown: [
          { href: '/courses', label: '📚 Courses', description: 'Explore course options' },
          { href: '/colleges', label: '🏫 Colleges', description: 'Find the right college' },
          { href: '/timeline', label: '📅 Timeline', description: 'Important dates & deadlines' }
        ]
      },
      { href: '/quiz', label: 'Career Quiz' },
      {
        label: 'AI Guidance',
        dropdown: [
          { href: '/mentor', label: '🤖 Virtual Mentor', description: 'Interactive AI career counselor' },
          { href: '/chat', label: '💬 AI Chat', description: 'Text-based AI assistance' },
          { href: '/recommendations', label: '✨ Recommendations', description: 'Personalized suggestions' }
        ]
      }
    ],
    user: [
      { href: '/profile', label: 'Profile' }
    ]
  };

  const isActiveLink = (href) => pathname === href;

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section - Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/" className="text-xl font-bold hover:drop-shadow-glow transition-all duration-300">
              🎓 Digital Guidance Platform
            </Link>
          </motion.div>

          {/* Center Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            {navStructure.main.filter(item =>
              isLoggedIn || (!item.href || !['dashboard', 'quiz', 'courses', 'colleges', 'timeline', 'recommendations', 'mentor', 'chat', 'profile'].includes(item.href.slice(1)))
            ).map((item, index) => (
              <div key={item.label || item.href} className="relative">
                {item.dropdown ? (
                  // Dropdown Menu Item
                  <div
                    className="relative navbar-dropdown"
                    onMouseEnter={() => setOpenDropdown(index)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      className={`flex items-center space-x-1 hover:text-gray-200 transition-colors duration-200 py-2 px-1 rounded ${
                        item.dropdown.some(subItem => isActiveLink(subItem.href))
                          ? 'text-yellow-300 bg-white bg-opacity-10'
                          : 'hover:bg-white hover:bg-opacity-10'
                      }`}
                    >
                      <span>{item.label}</span>
                      <motion.svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        animate={{ rotate: openDropdown === index ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </motion.svg>
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {openDropdown === index && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-2 w-72 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl shadow-2xl border border-white/20 py-2 z-50"
                        >
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className={`block px-4 py-3 text-white hover:bg-white/10 transition-colors duration-200 rounded-md mx-2 ${
                                isActiveLink(subItem.href) ? 'bg-white/20' : ''
                              }`}
                            >
                              <div className="flex items-start space-x-3">
                                <span className="text-lg">{subItem.label.split(' ')[0]}</span>
                                <div>
                                  <div className={`font-medium ${isActiveLink(subItem.href) ? 'text-white' : 'text-gray-200'}`}>
                                    {subItem.label.split(' ').slice(1).join(' ')}
                                  </div>
                                  <div className="text-sm text-gray-400 mt-1">
                                    {subItem.description}
                                  </div>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  // Regular Link
                  <Link
                    href={item.href}
                    className={`hover:text-gray-200 transition-colors duration-200 relative ${
                      isActiveLink(item.href) ? 'border-b-2 border-white pb-1' : ''
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Right Section - User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="relative navbar-dropdown"
                onMouseEnter={() => setOpenDropdown('user')}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button className="flex items-center space-x-2 hover:text-gray-200 transition-colors duration-200 py-2">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <motion.svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ rotate: openDropdown === 'user' ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </button>

                {/* User Dropdown */}
                <AnimatePresence>
                  {openDropdown === 'user' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl shadow-2xl border border-white/20 py-2 z-50"
                    >
                      <Link
                        href="/profile"
                        className={`block px-4 py-3 text-white hover:bg-white/10 transition-colors duration-200 rounded-md mx-2 ${
                          isActiveLink('/profile') ? 'bg-white/20' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-blue-400">👤</span>
                          <span className={`font-medium ${isActiveLink('/profile') ? 'text-white' : 'text-gray-200'}`}>
                            Profile
                          </span>
                        </div>
                      </Link>

                      <div className="border-t border-white/10 my-1 mx-2"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors duration-200 rounded-md mx-2"
                      >
                        <div className="flex items-center space-x-3">
                          <span>🚪</span>
                          <span className="font-medium">Logout</span>
                        </div>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link href="/login" className="hover:text-gray-200 hover:underline transition-all duration-200">
                  Login
                </Link>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/register" className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg font-medium transition-all duration-200">
                    Register
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleMobileMenu}
              className="p-2 rounded-md hover:bg-white/10 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-4 top-16 bg-gradient-to-br from-gray-700 to-gray-800 text-white shadow-xl rounded-xl w-72 py-3 z-50 border border-white/20"
          >
            {/* Mobile Navigation Items */}
            {navStructure.main.filter(item =>
              isLoggedIn || (!item.href || !['dashboard', 'quiz', 'courses', 'colleges', 'timeline', 'recommendations', 'mentor', 'chat', 'profile'].includes(item.href.slice(1)))
            ).map((item, index) => (
              <div key={item.label || item.href}>
                {item.dropdown ? (
                  // Mobile dropdown section
                  <div className="px-3 py-2">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      {item.label}
                    </div>
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-start space-x-3 px-3 py-2 hover:bg-white/10 transition-colors duration-200 rounded-lg ${
                          isActiveLink(subItem.href) ? 'bg-white/20' : ''
                        }`}
                      >
                        <span className="text-lg">{subItem.label.split(' ')[0]}</span>
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {subItem.label.split(' ').slice(1).join(' ')}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {subItem.description}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  // Regular mobile link
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-6 py-3 hover:bg-white/10 transition-colors duration-200 rounded-md mx-2 ${
                      isActiveLink(item.href) ? 'bg-white/20 font-medium' : ''
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
                {/* Separator */}
                {index < navStructure.main.length - 1 && !item.dropdown && (
                  <div className="border-t border-white/10 mx-4"></div>
                )}
              </div>
            ))}

            {/* User Section */}
            <div className="border-t border-white/20 mt-3 pt-3">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-6 py-2 hover:bg-white/10 transition-colors duration-200 rounded-md mx-2 ${
                      isActiveLink('/profile') ? 'bg-white/20' : ''
                    }`}
                  >
                    <span>👤</span>
                    <span className="font-medium">Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full px-6 py-2 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors duration-200 rounded-md mx-2"
                  >
                    <span>🚪</span>
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <div>
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-6 py-2 hover:bg-white/10 transition-colors duration-200 rounded-md mx-2"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-6 py-2 bg-white/20 hover:bg-white/30 transition-colors duration-200 font-medium rounded-md mx-2"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}