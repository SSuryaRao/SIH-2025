'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/login');
  };

  return (
    <nav className="flex flex-col md:flex-row justify-between items-center bg-blue-600 text-white px-6 py-3">
      <div className="mb-2 md:mb-0">
        <Link href="/" className="text-xl font-bold">
          Guidance Platform
        </Link>
      </div>

      <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0">
        <div className="flex flex-wrap justify-center md:justify-start">
          <Link href="/dashboard" className="mx-2 hover:underline">
            Dashboard
          </Link>
          <Link href="/quiz" className="mx-2 hover:underline">
            Quiz
          </Link>
          <Link href="/courses" className="mx-2 hover:underline">
            Courses
          </Link>
          <Link href="/colleges" className="mx-2 hover:underline">
            Colleges
          </Link>
          <Link href="/timeline" className="mx-2 hover:underline">
            Timeline
          </Link>
        </div>

        <div className="flex items-center ml-0 md:ml-4">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          ) : (
            <div className="flex space-x-2">
              <Link href="/login" className="mx-2 hover:underline">
                Login
              </Link>
              <Link href="/register" className="mx-2 hover:underline">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}