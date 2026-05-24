'use client';
import { useEffect, useState } from 'react';
import { getSaved } from '@/lib/api';
import { getToken, isLoggedIn } from '@/lib/auth';
import CollegeCard from '@/components/CollegeCard';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface College {
  id: number;
  name: string;
  location: string;
  fees: number;
  rating: number;
  courses: string[];
  placement_percent: number;
}

export default function SavedPage() {
  const router = useRouter();
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/login'); return; }
    const fetch = async () => {
      const token = getToken()!;
      const data = await getSaved(token);
      setColleges(Array.isArray(data) ? data : []);
      setLoading(false);
    };
    fetch();
  }, []);

  const refetch = async () => {
    const token = getToken()!;
    const data = await getSaved(token);
    setColleges(Array.isArray(data) ? data : []);
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Saved Colleges</h1>
      {colleges.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🤍</p>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No saved colleges yet</h2>
          <p className="text-gray-500 mb-6">Browse colleges and click the heart to save them here</p>
          <Link href="/colleges" className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700">Browse Colleges</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colleges.map((college) => (
            <CollegeCard
              key={college.id}
              college={college}
              isSaved={true}
              onSaveToggle={refetch}
            />
          ))}
        </div>
      )}
    </div>
  );
}