import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const today = () => new Date().toISOString().split('T')[0];
const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

const popularCities = [
  { name: 'Goa', emoji: '🌊' },
  { name: 'Mumbai', emoji: '🌆' },
  { name: 'Jaipur', emoji: '🏯' },
  { name: 'Delhi', emoji: '🕌' },
  { name: 'Shimla', emoji: '🏔️' },
  { name: 'Bengaluru', emoji: '🌳' },
];

const Hotel = () => {
  const router = useRouter();
  const [location, setLocation] = useState(router.query.location || '');
  const [checkin, setCheckin] = useState(today());
  const [checkout, setCheckout] = useState(tomorrow());
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);

  useEffect(() => {
    if (router.query.location) setLocation(router.query.location);
  }, [router.query.location]);

  const nights = Math.max(
    1,
    Math.round((new Date(checkout) - new Date(checkin)) / 86400000)
  );

  const handleSearch = () => {
    if (!location) return;
    router.push({
      pathname: '/hotel-results',
      query: { location, checkin, checkout, guests, rooms, nights },
    });
  };

  return (
    <div className="min-h-screen bg-cabotel-bg flex flex-col">
      {/* Header */}
      <div className="gradient-teal px-4 pb-8 pt-4">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/">
            <button className="w-9 h-9 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white hover:bg-opacity-30 transition-all">
              ←
            </button>
          </Link>
          <div>
            <h1 className="text-white font-display font-bold text-xl">Find a Stay</h1>
            <p className="text-cabotel-pale text-xs">Hotels, Resorts & more</p>
          </div>
        </div>

        {/* Search form card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Location */}
          <div className="px-4 py-4 border-b border-gray-100">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Destination</label>
            <div className="flex items-center gap-2">
              <span className="text-xl">🏙️</span>
              <input
                className="flex-1 text-cabotel-navy font-semibold text-base outline-none placeholder-gray-300"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, area or hotel name"
              />
              {location && (
                <button onClick={() => setLocation('')} className="text-gray-400 text-lg">×</button>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="flex border-b border-gray-100">
            <div className="flex-1 px-4 py-3 border-r border-gray-100">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Check-in</label>
              <input
                type="date"
                className="w-full text-cabotel-navy font-semibold text-sm outline-none"
                value={checkin}
                min={today()}
                onChange={(e) => {
                  setCheckin(e.target.value);
                  if (e.target.value >= checkout) {
                    const d = new Date(e.target.value);
                    d.setDate(d.getDate() + 1);
                    setCheckout(d.toISOString().split('T')[0]);
                  }
                }}
              />
            </div>
            <div className="flex-1 px-4 py-3">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Check-out</label>
              <input
                type="date"
                className="w-full text-cabotel-navy font-semibold text-sm outline-none"
                value={checkout}
                min={checkin}
                onChange={(e) => setCheckout(e.target.value)}
              />
            </div>
          </div>

          {/* Guests & Rooms */}
          <div className="flex px-4 py-3">
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Guests</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="w-8 h-8 rounded-full border-2 border-cabotel-teal text-cabotel-teal font-bold flex items-center justify-center hover:bg-cabotel-pale transition-all"
                >−</button>
                <span className="font-bold text-cabotel-navy w-4 text-center">{guests}</span>
                <button
                  onClick={() => setGuests(Math.min(12, guests + 1))}
                  className="w-8 h-8 rounded-full border-2 border-cabotel-teal text-cabotel-teal font-bold flex items-center justify-center hover:bg-cabotel-pale transition-all"
                >+</button>
              </div>
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Rooms</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setRooms(Math.max(1, rooms - 1))}
                  className="w-8 h-8 rounded-full border-2 border-cabotel-teal text-cabotel-teal font-bold flex items-center justify-center hover:bg-cabotel-pale transition-all"
                >−</button>
                <span className="font-bold text-cabotel-navy w-4 text-center">{rooms}</span>
                <button
                  onClick={() => setRooms(Math.min(5, rooms + 1))}
                  className="w-8 h-8 rounded-full border-2 border-cabotel-teal text-cabotel-teal font-bold flex items-center justify-center hover:bg-cabotel-pale transition-all"
                >+</button>
              </div>
            </div>
            <div className="flex-1 flex items-end">
              <div className="bg-cabotel-pale rounded-xl px-3 py-2 text-center">
                <p className="text-xs text-gray-500">Duration</p>
                <p className="font-bold text-cabotel-navy text-sm">{nights} night{nights !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Button */}
      <div className="px-4 -mt-4 z-10 relative">
        <button
          onClick={handleSearch}
          disabled={!location}
          className={`w-full py-4 rounded-2xl font-bold text-base transition-all shadow-card ${
            location
              ? 'bg-cabotel-orange text-white hover:shadow-cardHover hover:bg-orange-500 active:scale-95'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          🔍 Search Hotels
        </button>
      </div>

      {/* Popular Destinations */}
      <div className="px-4 mt-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Popular Destinations</p>
        <div className="grid grid-cols-3 gap-2">
          {popularCities.map((city) => (
            <button
              key={city.name}
              onClick={() => setLocation(city.name)}
              className={`flex flex-col items-center py-4 rounded-2xl border-2 transition-all ${
                location === city.name
                  ? 'border-cabotel-teal bg-cabotel-pale'
                  : 'border-gray-100 bg-white hover:border-cabotel-teal'
              }`}
            >
              <span className="text-3xl mb-1">{city.emoji}</span>
              <span className="text-xs font-bold text-cabotel-navy">{city.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="px-4 mt-6 pb-8">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Why Cabotel?</p>
          <div className="space-y-3">
            {[
              { icon: '🏷️', text: 'Best price guarantee on all bookings' },
              { icon: '🔄', text: 'Free cancellation on most hotels' },
              { icon: '🚗', text: 'Bundle with a ride and save 15%' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xl">{f.icon}</span>
                <p className="text-sm text-gray-600">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hotel;
