'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getCollege } from '@/lib/api';
import { getToken, isLoggedIn } from '@/lib/auth';
import { saveCollege, unsaveCollege } from '@/lib/api';

interface College {
  id: number;
  name: string;
  location: string;
  fees: number;
  rating: number;
  courses: string[];
  placement_percent: number;
  about: string;
  established: number;
}

export default function CollegeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const data = await getCollege(id as string);
      if (data.error) { router.push('/colleges'); return; }
      setCollege(data);
      setLoading(false);
    };
    fetch();
  }, [id]);

  const handleSave = async () => {
    if (!isLoggedIn()) { router.push('/login'); return; }
    const token = getToken()!;
    if (isSaved) {
      await unsaveCollege(college!.id, token);
      setIsSaved(false);
    } else {
      await saveCollege(college!.id, token);
      setIsSaved(true);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!college) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <button onClick={() => router.back()} className="text-blue-600 hover:underline mb-6 block">← Back</button>
      <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{college.name}</h1>
            <p className="text-gray-500">📍 {college.location} · Est. {college.established}</p>
          </div>
          <button onClick={handleSave} className="text-3xl">{isSaved ? '❤️' : '🤍'}</button>
        </div>
        <p className="text-gray-600 mt-4">{college.about}</p>
        <div className="grid grid-cols-3 gap-6 mt-6">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">₹{college.fees.toLocaleString()}</p>
            <p className="text-gray-500 text-sm mt-1">Annual Fees</p>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-yellow-500">⭐ {college.rating}</p>
            <p className="text-gray-500 text-sm mt-1">Rating</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{college.placement_percent}%</p>
            <p className="text-gray-500 text-sm mt-1">Placement Rate</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex-1 py-4 text-sm font-medium ${activeTab === 'courses' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          >
            Courses Offered
          </button>
          <button
            onClick={() => setActiveTab('placements')}
            className={`flex-1 py-4 text-sm font-medium ${activeTab === 'placements' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          >
            Placements
          </button>
        </div>
        <div className="p-6">
          {activeTab === 'courses' && (
            <div className="flex flex-wrap gap-3">
              {college.courses?.map((c) => (
                <span key={c} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-medium">{c}</span>
              ))}
            </div>
          )}
          {activeTab === 'placements' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-700 font-medium">Placement Rate</span>
                <span className="text-green-600 font-bold text-xl">{college.placement_percent}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="bg-green-500 h-4 rounded-full" style={{ width: `${college.placement_percent}%` }}></div>
              </div>
              <p className="text-gray-500 text-sm">{college.placement_percent >= 90 ? '🏆 Excellent placement record' : college.placement_percent >= 80 ? '✅ Good placement record' : '📈 Average placement record'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}