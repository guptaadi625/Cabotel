import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { hotelListData } from '../lib/hotelList';

const SORT_OPTIONS = ['Recommended', 'Price: Low', 'Price: High', 'Rating'];
const FILTER_TYPES = ['All', 'Luxury', 'Business', 'Resort', 'Heritage'];

const HotelResults = () => {
  const router = useRouter();
  const { location, checkin, checkout, guests, rooms, nights } = router.query;

  const [sort, setSort] = useState('Recommended');
  const [filter, setFilter] = useState('All');
  const [maxPrice, setMaxPrice] = useState(10000);

  const filteredHotels = hotelListData
    .filter((h) => {
      const matchesLocation =
        !location ||
        h.location.toLowerCase().includes(location.toLowerCase()) ||
        location.toLowerCase().includes(h.location.toLowerCase());
      const matchesType = filter === 'All' || h.type === filter;
      const matchesPrice = h.price <= maxPrice;
      return matchesLocation && matchesType && matchesPrice;
    })
    .sort((a, b) => {
      if (sort === 'Price: Low') return a.price - b.price;
      if (sort === 'Price: High') return b.price - a.price;
      if (sort === 'Rating') return b.rating - a.rating;
      return 0;
    });

  const numNights = parseInt(nights) || 1;

  return (
    <div className="min-h-screen bg-cabotel-bg flex flex-col">
      {/* Header */}
      <div className="gradient-navy px-4 pt-4 pb-5">
        <div className="flex items-center gap-3 mb-3">
          <Link href="/hotel">
            <button className="w-9 h-9 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white">
              ←
            </button>
          </Link>
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-bold text-base truncate">{location || 'All Hotels'}</h2>
            <p className="text-cabotel-pale text-xs">
              {checkin} → {checkout} · {guests} guest{guests > 1 ? 's' : ''} · {rooms} room{rooms > 1 ? 's' : ''}
            </p>
          </div>
          <Link href="/hotel">
            <button className="text-cabotel-pale text-xs border border-cabotel-light rounded-full px-3 py-1 hover:bg-white hover:bg-opacity-10">
              Edit
            </button>
          </Link>
        </div>

        {/* Sort tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {SORT_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${
                sort === s
                  ? 'bg-cabotel-amber text-cabotel-navy'
                  : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Filter chips */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex gap-2 overflow-x-auto">
          {FILTER_TYPES.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-semibold border transition-all ${
                filter === f
                  ? 'bg-cabotel-navy text-white border-cabotel-navy'
                  : 'border-gray-200 text-gray-600 hover:border-cabotel-teal'
              }`}
            >
              {f}
            </button>
          ))}
          <div className="flex items-center gap-2 ml-2 flex-shrink-0">
            <span className="text-xs text-gray-400">Max: ₹{maxPrice.toLocaleString()}</span>
            <input
              type="range"
              min={1000}
              max={10000}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-20 accent-cabotel-teal"
            />
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="px-4 py-2">
        <p className="text-xs text-gray-500">
          {filteredHotels.length} hotel{filteredHotels.length !== 1 ? 's' : ''} found
          {location ? ` in ${location}` : ''}
        </p>
      </div>

      {/* Hotel list */}
      <div className="flex-1 px-4 pb-6 space-y-4">
        {filteredHotels.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-5xl mb-3">🏨</span>
            <p className="font-bold text-cabotel-navy mb-1">No hotels found</p>
            <p className="text-sm text-gray-400">Try a different location or filters</p>
            <Link href="/hotel">
              <button className="mt-4 bg-cabotel-navy text-white px-5 py-2 rounded-xl text-sm font-semibold">
                Modify Search
              </button>
            </Link>
          </div>
        ) : (
          filteredHotels.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              nights={numNights}
              checkin={checkin}
              checkout={checkout}
              guests={guests}
              rooms={rooms}
            />
          ))
        )}
      </div>
    </div>
  );
};

const HotelCard = ({ hotel, nights, checkin, checkout, guests, rooms }) => {
  const totalPrice = hotel.price * nights * parseInt(rooms || 1);

  return (
    <Link
      href={{
        pathname: '/hotel-confirm',
        query: {
          id: hotel.id,
          checkin,
          checkout,
          guests,
          rooms,
          nights,
        },
      }}
    >
      <div className="bg-white rounded-2xl shadow-card hover:shadow-cardHover transition-all overflow-hidden cursor-pointer">
        {/* Image */}
        <div className="relative h-44 w-full overflow-hidden">
          <Image
            src={hotel.imgUrl}
            alt={hotel.name}
            layout="fill"
            objectFit="cover"
            className="hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <span className="bg-cabotel-amber text-cabotel-navy text-xs font-bold px-2 py-1 rounded-full">
              {hotel.tag}
            </span>
          </div>
          <div className="absolute top-3 right-3 bg-white rounded-xl px-2 py-1 flex items-center gap-1">
            <span className="text-yellow-400 text-xs">★</span>
            <span className="text-xs font-bold text-cabotel-navy">{hotel.rating}</span>
          </div>
        </div>

        {/* Details */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-1">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-cabotel-navy text-base truncate">{hotel.name}</h3>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                📍 {hotel.address} · {hotel.distanceFromCenter} from center
              </p>
            </div>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-1 my-2">
            {hotel.amenities.slice(0, 4).map((a) => (
              <span key={a} className="text-xs bg-cabotel-pale text-cabotel-blue px-2 py-0.5 rounded-full">
                {a}
              </span>
            ))}
            {hotel.amenities.length > 4 && (
              <span className="text-xs text-gray-400 px-1 py-0.5">
                +{hotel.amenities.length - 4} more
              </span>
            )}
          </div>

          {/* Price + CTA */}
          <div className="flex items-end justify-between mt-2 pt-2 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-400">{nights} night{nights !== 1 ? 's' : ''} · {rooms} room{rooms > 1 ? 's' : ''}</p>
              <div className="flex items-baseline gap-1">
                <span className="font-bold text-cabotel-navy text-xl">₹{totalPrice.toLocaleString()}</span>
                <span className="text-xs text-gray-400">total</span>
              </div>
              <p className="text-xs text-gray-400">₹{hotel.price.toLocaleString()}/night</p>
            </div>
            <button className="bg-cabotel-navy text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-cabotel-blue transition-all">
              View →
            </button>
          </div>

          {/* Reviews */}
          <p className="text-xs text-gray-400 mt-1">
            <span className="text-cabotel-teal font-semibold">{hotel.rating} / 5</span>
            {' '}({hotel.reviewCount.toLocaleString()} reviews)
          </p>
        </div>
      </div>
    </Link>
  );
};

export default HotelResults;
