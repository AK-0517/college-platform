'use client';
import { useEffect, useState } from 'react';
import { getColleges } from '@/lib/api';
import { getToken, isLoggedIn } from '@/lib/auth';
import CollegeCard from '@/components/CollegeCard';
import FilterBar from '@/components/FilterBar';
import CompareBar from '@/components/CompareBar';

interface College {
  id: number;
  name: string;
  location: string;
  fees: number;
  rating: number;
  courses: string[];
  placement_percent: number;
}

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [selected, setSelected] = useState<College[]>([]);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [maxFees, setMaxFees] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchColleges = async () => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, string> = { page: String(page), limit: '9' };
      if (search) params.search = search;
      if (location) params.location = location;
      if (maxFees) params.maxFees = maxFees;
      const data = await getColleges(params);
      setColleges(data.colleges || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      setError('Failed to load colleges. Please try again.');
    }
    setLoading(false);
  };

  const fetchSaved = async () => {
    if (!isLoggedIn()) return;
    try {
      const token = getToken()!;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/saved`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setSavedIds(data.map((c: College) => c.id));
    } catch {}
  };

  useEffect(() => { fetchColleges(); }, [search, location, maxFees, page]);
  useEffect(() => { fetchSaved(); }, []);

  const handleCompareToggle = (college: College) => {
    setSelected(prev => {
      if (prev.find(c => c.id === college.id)) return prev.filter(c => c.id !== college.id);
      if (prev.length >= 3) return prev;
      return [...prev, college];
    });
  };

  const handleReset = () => {
    setSearch(''); setLocation(''); setMaxFees(''); setPage(1);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 pb-28">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Browse Colleges</h1>
      <div className="mb-6">
        <FilterBar
          search={search} location={location} maxFees={maxFees}
          onSearch={(v) => { setSearch(v); setPage(1); }}
          onLocation={(v) => { setLocation(v); setPage(1); }}
          onMaxFees={(v) => { setMaxFees(v); setPage(1); }}
          onReset={handleReset}
        />
      </div>

      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {error && (
        <div className="text-center py-20 text-red-500">{error}</div>
      )}

      {!loading && !error && colleges.length === 0 && (
        <div className="text-center py-20">
          <p className="text-2xl mb-2">🔍</p>
          <p className="text-gray-500">No colleges found. Try different filters.</p>
        </div>
      )}

      {!loading && !error && colleges.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colleges.map((college) => (
              <CollegeCard
                key={college.id}
                college={college}
                isSaved={savedIds.includes(college.id)}
                onSaveToggle={fetchSaved}
                isSelected={!!selected.find(c => c.id === college.id)}
                onCompareToggle={handleCompareToggle}
              />
            ))}
          </div>
          <div className="flex justify-center items-center gap-4 mt-10">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
            >
              ← Prev
            </button>
            <span className="text-gray-600 text-sm">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
            >
              Next →
            </button>
          </div>
        </>
      )}
      <CompareBar selected={selected} onRemove={(id) => setSelected(prev => prev.filter(c => c.id !== id))} onClear={() => setSelected([])} />
    </div>
  );
}