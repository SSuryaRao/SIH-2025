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
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

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

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/quiz', label: 'Quiz' },
    { href: '/courses', label: 'Courses' },
    { href: '/colleges', label: 'Colleges' },
    { href: '/timeline', label: 'Timeline' },
    { href: '/recommendations', label: 'Recommendations' },
    { href: '/mentor', label: '🤖 Virtual Mentor' },
    { href: '/chat', label: '💬 AI Chat' },
    { href: '/profile', label: 'Profile' }
  ];

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
          <div className="hidden md:flex space-x-8">
            {navLinks.filter(link => isLoggedIn || !['dashboard', 'quiz', 'courses', 'colleges', 'timeline', 'recommendations', 'mentor', 'chat', 'profile'].includes(link.href.slice(1))).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`hover:text-gray-200 transition-colors duration-200 relative ${
                  isActiveLink(link.href) ? 'border-b-2 border-white pb-1' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section - Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Logout
              </motion.button>
            ) : (
              <div className="flex space-x-4">
                <Link href="/login" className="hover:text-gray-200 hover:underline transition-all duration-200">
                  Login
                </Link>
                <Link href="/register" className="hover:text-gray-200 hover:underline transition-all duration-200">
                  Register
                </Link>
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
            className="absolute right-4 top-16 bg-white text-gray-900 shadow-lg rounded-lg w-48 py-2 z-50"
          >
            {navLinks.filter(link => isLoggedIn || !['dashboard', 'quiz', 'courses', 'colleges', 'timeline', 'recommendations', 'mentor', 'chat', 'profile'].includes(link.href.slice(1))).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-2 hover:bg-gray-100 transition-colors duration-200 rounded-md mx-2 ${
                  isActiveLink(link.href) ? 'bg-indigo-50 text-indigo-600 font-medium' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-gray-200 mt-2 pt-2">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 rounded-md mx-2"
                >
                  Logout
                </button>
              ) : (
                <div>
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-100 transition-colors duration-200 rounded-md mx-2"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-100 transition-colors duration-200 rounded-md mx-2"
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