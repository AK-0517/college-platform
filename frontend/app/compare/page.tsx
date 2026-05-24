'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { compareColleges } from '@/lib/api';
import Link from 'next/link';
import { Suspense } from 'react';

interface College {
  id: number;
  name: string;
  location: string;
  fees: number;
  rating: number;
  courses: string[];
  placement_percent: number;
  established: number;
}

function CompareContent() {
  const searchParams = useSearchParams();
  const ids = searchParams.get('ids');
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ids) return;
    const fetch = async () => {
      setLoading(true);
      const idArray = ids.split(',').map(Number);
      const data = await compareColleges(idArray);
      if (data.error) { setError(data.error); setLoading(false); return; }
      setColleges(data.colleges);
      setLoading(false);
    };
    fetch();
  }, [ids]);

  if (!ids || colleges.length === 0) return (
    <div className="text-center py-20">
      <p className="text-4xl mb-4">⚖️</p>
      <h2 className="text-xl font-bold text-gray-800 mb-2">No colleges selected</h2>
      <p className="text-gray-500 mb-6">Go to the colleges page and select 2–3 colleges to compare</p>
      <Link href="/colleges" className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700">Browse Colleges</Link>
    </div>
  );

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const rows = [
    { label: 'Location', key: 'location', format: (v: any) => `📍 ${v}` },
    { label: 'Annual Fees', key: 'fees', format: (v: any) => `₹${Number(v).toLocaleString()}` },
    { label: 'Rating', key: 'rating', format: (v: any) => `⭐ ${v}` },
    { label: 'Placement %', key: 'placement_percent', format: (v: any) => `${v}%` },
    { label: 'Established', key: 'established', format: (v: any) => v },
    { label: 'Courses', key: 'courses', format: (v: any) => Array.isArray(v) ? v.join(', ') : v },
  ];

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left py-4 px-4 text-gray-500 font-medium w-32">Feature</th>
              {colleges.map((c) => (
                <th key={c.id} className="py-4 px-4 text-center">
                  <Link href={`/colleges/${c.id}`} className="text-blue-600 font-bold hover:underline">{c.name}</Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.key} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="py-4 px-4 text-gray-600 font-medium text-sm">{row.label}</td>
                {colleges.map((c) => (
                  <td key={c.id} className="py-4 px-4 text-center text-gray-800 text-sm">
                    {row.format((c as any)[row.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Compare Colleges</h1>
        <Link href="/colleges" className="text-blue-600 hover:underline text-sm">← Back to Colleges</Link>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading...</div>}>
          <CompareContent />
        </Suspense>
      </div>
    </div>
  );
}