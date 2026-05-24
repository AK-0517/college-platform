'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUser, removeToken, isLoggedIn } from '@/lib/auth';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    setLoggedIn(isLoggedIn());
    const user = getUser();
    if (user) setUserName(user.name || user.email);
  }, []);

  const handleLogout = () => {
    removeToken();
    setLoggedIn(false);
    router.push('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <Link href="/" className="text-xl font-bold text-blue-600">CollegeFinder</Link>
      <div className="flex items-center gap-6">
        <Link href="/colleges" className="text-gray-600 hover:text-blue-600 font-medium">Colleges</Link>
        <Link href="/compare" className="text-gray-600 hover:text-blue-600 font-medium">Compare</Link>
        {loggedIn && (
          <Link href="/saved" className="text-gray-600 hover:text-blue-600 font-medium">Saved</Link>
        )}
        {loggedIn ? (
          <div className="flex items-center gap-3">
            <span className="text-gray-700 font-medium">{userName}</span>
            <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700">Logout</button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
            <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
}