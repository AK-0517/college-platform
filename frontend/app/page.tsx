import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Find Your <span className="text-blue-600">Dream College</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10">
          Search, compare and save colleges across India. Make the right decision with real data.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/colleges" className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition">
            Browse Colleges
          </Link>
          <Link href="/compare" className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition">
            Compare Colleges
          </Link>
        </div>
        <div className="mt-20 grid grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-3xl mb-2">🏫</div>
            <h3 className="font-bold text-gray-900 mb-1">25+ Colleges</h3>
            <p className="text-gray-500 text-sm">Top engineering colleges across India</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-3xl mb-2">⚖️</div>
            <h3 className="font-bold text-gray-900 mb-1">Compare Side by Side</h3>
            <p className="text-gray-500 text-sm">Compare fees, ratings and placements</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-3xl mb-2">❤️</div>
            <h3 className="font-bold text-gray-900 mb-1">Save Favourites</h3>
            <p className="text-gray-500 text-sm">Create your personal shortlist</p>
          </div>
        </div>
      </div>
    </div>
  );
}