'use client';

interface Props {
  search: string;
  location: string;
  maxFees: string;
  onSearch: (v: string) => void;
  onLocation: (v: string) => void;
  onMaxFees: (v: string) => void;
  onReset: () => void;
}

export default function FilterBar({ search, location, maxFees, onSearch, onLocation, onMaxFees, onReset }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-wrap gap-3 items-end">
      <div className="flex-1 min-w-[200px]">
        <label className="text-xs text-gray-500 mb-1 block">Search College</label>
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="e.g. IIT Bombay"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="min-w-[160px]">
        <label className="text-xs text-gray-500 mb-1 block">Location</label>
        <input
          value={location}
          onChange={(e) => onLocation(e.target.value)}
          placeholder="e.g. Mumbai"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="min-w-[160px]">
        <label className="text-xs text-gray-500 mb-1 block">Max Fees (₹)</label>
        <select
          value={maxFees}
          onChange={(e) => onMaxFees(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="">Any</option>
          <option value="50000">Under ₹50,000</option>
          <option value="100000">Under ₹1,00,000</option>
          <option value="200000">Under ₹2,00,000</option>
          <option value="300000">Under ₹3,00,000</option>
          <option value="500000">Under ₹5,00,000</option>
        </select>
      </div>
      <button
        onClick={onReset}
        className="px-4 py-2 text-sm text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50"
      >
        Reset
      </button>
    </div>
  );
}