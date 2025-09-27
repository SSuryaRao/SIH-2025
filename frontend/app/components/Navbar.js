'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, ChevronDown, LogOut, UserCircle, Settings } from 'lucide-react';

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

  useEffect(() => {
    if (!mounted) return;
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

  const navStructure = {
    main: [
      {
        label: 'Discover',
        dropdown: [
          { href: '/courses', label: '📚 Courses', description: 'Explore course options' },
          { href: '/colleges', label: '🏫 Colleges', description: 'Find the right college' },
          { href: '/timeline', label: '📅 Timeline', description: 'Important dates & deadlines' },
          { href: '/scholarships', label: '🎓 Scholarships', description: 'Find funding opportunities' },
          { href: '/stakeholders', label: '🤝 Stakeholder Hub', description: 'Connect with education professionals' }
        ]
      },
      {
        label: 'Resources',
        dropdown: [
          { href: '/library', label: '📖 Digital Library', description: 'E-books, study materials, and video lectures' },
          { href: '/video-lectures', label: '🎬 Video Lectures', description: 'Educational videos from top institutions' },
          { href: '/study-materials', label: '📄 Study Materials', description: 'Notes, guides, and reference materials' },
          { href: '/external-links', label: '🔗 External Links', description: 'Curated educational websites and tools' }
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
      },
      { href: '/alumni', label: 'Alumni Stories' }
    ],
    user: [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/profile', label: 'Profile' }
    ]
  };

  const isActiveLink = (href) => pathname === href;

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-600/95 via-indigo-600/95 to-purple-600/95 backdrop-blur-md text-white shadow-2xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-white/20 to-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/20">
              <span className="text-2xl">🎓</span>
            </div>
            <Link href="/" className="text-lg md:text-xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent hover:from-blue-100 hover:to-white transition-all duration-300">
              Digital Guidance
            </Link>
          </motion.div>

          <div className="hidden md:flex items-center space-x-1">
            {navStructure.main.filter(item =>
              isLoggedIn || (!item.href || !['/dashboard', '/quiz', '/recommendations', '/mentor', '/chat', '/profile'].some(p => item.href.startsWith(p)))
            ).map((item, index) => (
              <div key={item.label || item.href} className="relative">
                {item.dropdown ? (
                  <div
                    className="relative navbar-dropdown"
                    onMouseEnter={() => setOpenDropdown(index)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                        item.dropdown.some(subItem => isActiveLink(subItem.href))
                          ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/20'
                          : 'hover:bg-white/10 hover:text-blue-100'
                      }`}
                    >
                      <span>{item.label}</span>
                      <motion.div
                        animate={{ rotate: openDropdown === index ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {openDropdown === index && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-3 w-80 bg-indigo-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 py-3 z-50 ring-2 ring-white/20"
                        >
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className={`block px-5 py-4 text-white hover:bg-white/25 transition-all duration-300 rounded-xl mx-3 group ${
                                isActiveLink(subItem.href) ? 'bg-white/30 shadow-lg backdrop-blur-sm border border-white/40 ring-1 ring-white/20 text-white font-bold' : 'hover:shadow-lg hover:bg-white/20'
                              }`}
                            >
                              <div className="flex items-start space-x-4">
                                <div className="text-2xl group-hover:scale-110 transition-transform duration-200">{subItem.label.split(' ')[0]}</div>
                                <div className="flex-1">
                                  <div className={`font-bold text-base ${isActiveLink(subItem.href) ? 'text-white' : 'text-white'}`}>{subItem.label.split(' ').slice(1).join(' ')}</div>
                                  <div className="text-sm text-gray-200 mt-1">{subItem.description}</div>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 relative ${
                      isActiveLink(item.href)
                        ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/20'
                        : 'hover:bg-white/10 hover:text-blue-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="relative navbar-dropdown" onMouseEnter={() => setOpenDropdown('user')} onMouseLeave={() => setOpenDropdown(null)}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-3 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 border border-white/20 backdrop-blur-sm shadow-lg group"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center shadow-md">
                    <UserCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-blue-100 group-hover:text-white transition-colors duration-200">Account</span>
                  <ChevronDown className="w-4 h-4 text-blue-200 group-hover:text-white transition-all duration-200" />
                </motion.button>
                <AnimatePresence>
                  {openDropdown === 'user' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-3 w-56 bg-indigo-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 py-3 z-50 ring-2 ring-white/20"
                    >
                      <Link
                        href="/dashboard"
                        className={`block px-5 py-4 text-white hover:bg-white/25 transition-all duration-300 rounded-xl mx-3 group ${
                          isActiveLink('/dashboard') ? 'bg-white/30 shadow-lg backdrop-blur-sm border border-white/40 ring-1 ring-white/20 font-bold' : 'hover:shadow-lg hover:bg-white/20'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200">
                            <span className="text-white text-sm">📊</span>
                          </div>
                          <div className="flex-1">
                            <span className={`font-bold text-base ${isActiveLink('/dashboard') ? 'text-white' : 'text-white'}`}>Dashboard</span>
                            <div className="text-sm text-gray-200">Your personal overview</div>
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="/profile"
                        className={`block px-5 py-4 text-white hover:bg-white/25 transition-all duration-300 rounded-xl mx-3 group ${
                          isActiveLink('/profile') ? 'bg-white/30 shadow-lg backdrop-blur-sm border border-white/40 ring-1 ring-white/20 font-bold' : 'hover:shadow-lg hover:bg-white/20'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <span className={`font-bold text-base ${isActiveLink('/profile') ? 'text-white' : 'text-white'}`}>Profile</span>
                            <div className="text-sm text-gray-200">Manage your account</div>
                          </div>
                        </div>
                      </Link>
                      
                      <div className="border-t border-white/20 my-2 mx-3"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-5 py-4 text-white hover:bg-red-500/30 hover:text-red-200 transition-all duration-300 rounded-xl mx-3 group hover:shadow-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200">
                            <LogOut className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <span className="font-bold text-base text-red-200 group-hover:text-red-100">Logout</span>
                            <div className="text-sm text-red-300">Sign out of account</div>
                          </div>
                        </div>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl font-medium text-blue-100 hover:text-white hover:bg-white/10 transition-all duration-300 border border-transparent hover:border-white/20"
                >
                  Login
                </Link>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/register"
                    className="px-6 py-2 rounded-xl font-semibold bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-white border border-white/20 hover:border-white/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Register
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleMobileMenu}
              className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 border border-white/20 backdrop-blur-sm shadow-lg"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-4 top-20 bg-indigo-900/95 backdrop-blur-xl text-white shadow-2xl rounded-2xl w-80 py-4 z-50 border border-white/30 ring-2 ring-white/20 max-h-[calc(100vh-6rem)] overflow-y-auto"
          >
            {navStructure.main.filter(item =>
              isLoggedIn || (!item.href || !['/dashboard', '/quiz', '/recommendations', '/mentor', '/chat', '/profile'].some(p => item.href.startsWith(p)))
            ).map((item, index) => (
              <div key={item.label || item.href}>
                {item.dropdown ? (
                  <div className="px-4 py-3">
                    <div className="text-xs font-bold text-white uppercase tracking-wider mb-3">{item.label}</div>
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-start space-x-4 px-4 py-3 hover:bg-white/25 transition-all duration-300 rounded-xl mb-2 group ${
                          isActiveLink(subItem.href) ? 'bg-white/30 shadow-lg backdrop-blur-sm border border-white/40 ring-1 ring-white/20 font-bold' : 'hover:shadow-lg hover:bg-white/20'
                        }`}
                      >
                        <div className="text-xl group-hover:scale-110 transition-transform duration-200">{subItem.label.split(' ')[0]}</div>
                        <div className="flex-1">
                          <div className={`font-bold text-sm ${isActiveLink(subItem.href) ? 'text-white' : 'text-white'}`}>{subItem.label.split(' ').slice(1).join(' ')}</div>
                          <div className="text-xs text-gray-200 mt-1">{subItem.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-6 py-4 hover:bg-white/25 transition-all duration-300 rounded-xl mx-3 mb-2 font-bold text-white ${
                      isActiveLink(item.href) ? 'bg-white/30 shadow-lg backdrop-blur-sm border border-white/40 ring-1 ring-white/20' : 'hover:shadow-lg hover:bg-white/20'
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
                {index < navStructure.main.length - 1 && !item.dropdown && <div className="border-t border-white/10 mx-4"></div>}
              </div>
            ))}
            <div className="border-t border-white/20 mt-4 pt-4">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-4 px-6 py-4 hover:bg-white/25 transition-all duration-300 rounded-xl mx-3 mb-2 group ${
                      isActiveLink('/dashboard') ? 'bg-white/30 shadow-lg backdrop-blur-sm border border-white/40 ring-1 ring-white/20 font-bold' : 'hover:shadow-lg hover:bg-white/20'
                    }`}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200">
                      <span className="text-white text-sm">📊</span>
                    </div>
                    <div className="flex-1">
                      <span className={`font-bold ${isActiveLink('/dashboard') ? 'text-white' : 'text-white'}`}>Dashboard</span>
                      <div className="text-sm text-gray-200">Your personal overview</div>
                    </div>
                  </Link>

                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-4 px-6 py-4 hover:bg-white/25 transition-all duration-300 rounded-xl mx-3 mb-2 group ${
                      isActiveLink('/profile') ? 'bg-white/30 shadow-lg backdrop-blur-sm border border-white/40 ring-1 ring-white/20 font-bold' : 'hover:shadow-lg hover:bg-white/20'
                    }`}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <span className={`font-bold ${isActiveLink('/profile') ? 'text-white' : 'text-white'}`}>Profile</span>
                      <div className="text-sm text-gray-200">Manage your account</div>
                    </div>
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-4 px-6 py-4 hover:bg-white/25 transition-all duration-300 rounded-xl mx-3 mb-2 group hover:shadow-lg hover:bg-white/20"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200">
                      <Settings className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <span className="font-bold text-white">Settings</span>
                      <div className="text-sm text-gray-200">App preferences</div>
                    </div>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-4 w-full px-6 py-4 hover:bg-red-500/30 hover:text-red-200 transition-all duration-300 rounded-xl mx-3 group hover:shadow-lg"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200">
                      <LogOut className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <span className="font-bold text-red-200 group-hover:text-red-100">Logout</span>
                      <div className="text-sm text-red-300">Sign out of account</div>
                    </div>
                  </button>
                </>
              ) : (
                <div className="px-3">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-6 py-4 hover:bg-white/25 transition-all duration-300 rounded-xl mb-2 font-bold text-white hover:shadow-lg hover:bg-white/20"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-6 py-4 bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 transition-all duration-300 font-bold rounded-xl border border-white/20 hover:border-white/30 backdrop-blur-sm shadow-lg hover:shadow-xl text-white"
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
