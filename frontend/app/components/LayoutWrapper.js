'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  // Hide navbar on login and register pages
  const hideNavbar = pathname === '/login' || pathname === '/register';

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}