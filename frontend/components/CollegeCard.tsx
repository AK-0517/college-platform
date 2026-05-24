'use client';
import Link from 'next/link';
import { saveCollege, unsaveCollege } from '@/lib/api';
import { getToken, isLoggedIn } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface College {
  id: number;
  name: string;
  location: string;
  fees: number;
  rating: number;
  courses: string[];
  placement_percent: number;
}

interface Props {
  college: College;
  isSaved?: boolean;
  onSaveToggle?: () => void;
  isSelected?: boolean;
  onCompareToggle?: (college: College) => void;
}

export default function CollegeCard({ college, isSaved = false, onSaveToggle, isSelected = false, onCompareToggle }: Props) {
  const router = useRouter();

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn()) { router.push('/login'); return; }
    const token = getToken()!;
    if (isSaved) {
      await unsaveCollege(college.id, token);
    } else {
      await saveCollege(college.id, token);
    }
    if (onSaveToggle) onSaveToggle();
  };

  return (
    <div className={`bg-white rounded-xl border-2 ${isSelected ? 'border-blue-500' : 'border-gray-200'} p-5 hover:shadow-md transition-shadow`}>
      <div className="flex justify-between items-start mb-3">
        <Link href={`/colleges/${college.id}`}>
          <h3 className="font-bold text-gray-900 text-lg hover:text-blue-600 cursor-pointer">{college.name}</h3>
        </Link>
        <button onClick={handleSave} className="text-2xl">
          {isSaved ? '❤️' : '🤍'}
        </button>
      </div>
      <p className="text-gray-500 text-sm mb-3">📍 {college.location}</p>
      <div className="flex gap-4 mb-3">
        <div className="text-sm">
          <span className="text-gray-500">Fees</span>
          <p className="font-semibold text-gray-800">₹{college.fees.toLocaleString()}</p>
        </div>
        <div className="text-sm">
          <span className="text-gray-500">Rating</span>
          <p className="font-semibold text-yellow-500">⭐ {college.rating}</p>
        </div>
        <div className="text-sm">
          <span className="text-gray-500">Placement</span>
          <p className="font-semibold text-green-600">{college.placement_percent}%</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1 mb-4">
        {college.courses?.slice(0, 3).map((c) => (
          <span key={c} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">{c}</span>
        ))}
      </div>
      <div className="flex gap-2">
        <Link href={`/colleges/${college.id}`} className="flex-1 text-center text-sm bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
          View Details
        </Link>
        <button
          onClick={() => onCompareToggle && onCompareToggle(college)}
          className={`flex-1 text-sm py-2 rounded-lg border ${isSelected ? 'bg-blue-100 border-blue-500 text-blue-700' : 'border-gray-300 text-gray-600 hover:border-blue-400'}`}
        >
          {isSelected ? '✓ Selected' : '+ Compare'}
        </button>
      </div>
    </div>
  );
}