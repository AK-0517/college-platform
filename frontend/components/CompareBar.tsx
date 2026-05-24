'use client';
import { useRouter } from 'next/navigation';

interface College {
  id: number;
  name: string;
}

interface Props {
  selected: College[];
  onRemove: (id: number) => void;
  onClear: () => void;
}

export default function CompareBar({ selected, onRemove, onClear }: Props) {
  const router = useRouter();
  if (selected.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-blue-500 shadow-lg px-6 py-4 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-gray-700">Compare ({selected.length}/3):</span>
          {selected.map((c) => (
            <span key={c.id} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
              {c.name}
              <button onClick={() => onRemove(c.id)} className="text-blue-400 hover:text-blue-700">✕</button>
            </span>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={onClear} className="text-gray-500 hover:text-gray-700 text-sm">Clear</button>
          <button
            onClick={() => router.push(`/compare?ids=${selected.map(c => c.id).join(',')}`)}
            disabled={selected.length < 2}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            Compare Now
          </button>
        </div>
      </div>
    </div>
  );
}