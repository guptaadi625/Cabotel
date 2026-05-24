import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const recentPlaces = [
  { label: 'Home', sub: 'Saved address', icon: '🏠' },
  { label: 'Office', sub: 'Saved address', icon: '🏢' },
  { label: 'Mumbai Airport', sub: 'Chhatrapati Shivaji Maharaj International Airport', icon: '✈️' },
  { label: 'City Mall', sub: 'LBS Marg, Mumbai', icon: '🛍️' },
];

const Search = () => {
  const router = useRouter();
  const [pickup, setPickup] = useState(router.query.pickup || '');
  const [dropoff, setDropoff] = useState(router.query.dropoff || '');

  const handleConfirm = () => {
    if (!pickup || !dropoff) return;
    router.push({ pathname: '/confirm', query: { pickup, dropoff } });
  };

  return (
    <div className="min-h-screen bg-cabotel-bg flex flex-col">
      {/* Header */}
      <div className="gradient-navy px-4 pt-safe pb-4">
        <div className="flex items-center gap-3 mb-4 pt-4">
          <Link href="/">
            <button className="w-9 h-9 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white hover:bg-opacity-30 transition-all">
              ←
            </button>
          </Link>
          <h2 className="text-white font-semibold text-lg">Book a Ride</h2>
        </div>

        {/* Input Fields */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
          <div className="flex items-center px-4 py-3 border-b border-gray-100">
            <div className="w-3 h-3 rounded-full bg-cabotel-navy mr-3 flex-shrink-0" />
            <input
              className="flex-1 text-cabotel-navy text-sm font-medium outline-none placeholder-gray-400"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder="Pickup location"
            />
            {pickup && (
              <button onClick={() => setPickup('')} className="text-gray-400 hover:text-gray-600 text-lg leading-none ml-2">×</button>
            )}
          </div>
          <div className="flex items-center px-4 py-3">
            <div className="w-3 h-3 rounded-sm bg-cabotel-orange mr-3 flex-shrink-0" />
            <input
              className="flex-1 text-cabotel-navy text-sm font-medium outline-none placeholder-gray-400"
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
              placeholder="Where to?"
            />
            {dropoff && (
              <button onClick={() => setDropoff('')} className="text-gray-400 hover:text-gray-600 text-lg leading-none ml-2">×</button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4">
        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          disabled={!pickup || !dropoff}
          className={`w-full py-4 rounded-2xl font-bold text-base transition-all mb-6 ${
            pickup && dropoff
              ? 'bg-cabotel-navy text-white shadow-card hover:shadow-cardHover hover:bg-cabotel-blue active:scale-95'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {pickup && dropoff ? 'See Available Rides →' : 'Enter pickup & destination'}
        </button>

        {/* Saved & Recent */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Saved & Recent</p>
          </div>
          {recentPlaces.map((place, i) => (
            <button
              key={i}
              onClick={() => {
                if (!pickup) setPickup(place.label);
                else setDropoff(place.label);
              }}
              className="w-full flex items-center px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg mr-3 flex-shrink-0">
                {place.icon}
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-sm font-semibold text-cabotel-navy">{place.label}</p>
                <p className="text-xs text-gray-400 truncate">{place.sub}</p>
              </div>
              <span className="text-gray-300 ml-2">→</span>
            </button>
          ))}
        </div>

        {/* Promo */}
        <div className="mt-4 bg-cabotel-pale border border-cabotel-light rounded-2xl px-4 py-3 flex items-center gap-3">
          <span className="text-2xl">🎁</span>
          <div>
            <p className="text-sm font-bold text-cabotel-navy">First ride free!</p>
            <p className="text-xs text-cabotel-blue">Apply code CABOTEL1ST at checkout</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
