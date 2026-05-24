import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Link from 'next/link';
import RideSelector from '../components/RideSelector';

const Map = dynamic(() => import('../components/Map'), { ssr: false });

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

function haversineKm(c1, c2) {
  if (!c1 || !c2) return 0;
  const R = 6371;
  const dLat = ((c2[1] - c1[1]) * Math.PI) / 180;
  const dLon = ((c2[0] - c1[0]) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((c1[1] * Math.PI) / 180) *
      Math.cos((c2[1] * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function geocode(place) {
  const res = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(place)}.json?access_token=${MAPBOX_TOKEN}&limit=1`
  );
  const data = await res.json();
  return data?.features?.[0]?.center ?? null;
}

const Confirm = () => {
  const router = useRouter();
  const { pickup, dropoff } = router.query;

  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [booking, setBooking] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (pickup) geocode(pickup).then(setPickupCoords);
    if (dropoff) geocode(dropoff).then(setDropoffCoords);
  }, [pickup, dropoff]);

  const distance = haversineKm(pickupCoords, dropoffCoords);

  const handleConfirm = () => {
    if (!selectedCar) return;
    setBooking(true);
    setTimeout(() => {
      setBooking(false);
      setConfirmed(true);
    }, 2000);
  };

  if (confirmed) {
    return <BookingSuccess car={selectedCar} pickup={pickup} dropoff={dropoff} distance={distance} />;
  }

  return (
    <div className="flex flex-col h-screen bg-cabotel-bg overflow-hidden">
      {/* Map */}
      <div className="relative" style={{ height: '45vh' }}>
        <Map fromLocation={pickupCoords} toLocation={dropoffCoords} />
        <Link href="/search">
          <button className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-white shadow-card flex items-center justify-center text-cabotel-navy font-bold hover:shadow-cardHover transition-all">
            ←
          </button>
        </Link>
        {/* Route label */}
        {pickup && dropoff && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-white rounded-full px-4 py-2 shadow-card flex items-center gap-2 max-w-xs">
            <div className="w-2 h-2 rounded-full bg-cabotel-navy flex-shrink-0" />
            <p className="text-xs text-cabotel-navy font-medium truncate">{pickup}</p>
            <span className="text-gray-300">→</span>
            <div className="w-2 h-2 rounded-sm bg-cabotel-orange flex-shrink-0" />
            <p className="text-xs text-cabotel-navy font-medium truncate">{dropoff}</p>
          </div>
        )}
      </div>

      {/* Ride selection */}
      <div className="flex-1 overflow-hidden flex flex-col bg-white rounded-t-3xl -mt-4 relative z-10">
        <RideSelector
          selectedCar={selectedCar}
          onCarSelect={setSelectedCar}
          distance={distance}
        />

        {/* Confirm bar */}
        <div className="px-4 py-3 border-t border-gray-100 bg-white">
          {selectedCar ? (
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-xs text-gray-500">Booking {selectedCar.service}</p>
                <p className="font-bold text-cabotel-navy">
                  ₹{Math.round(selectedCar.ratePerKm * (distance || 10))}
                  {distance > 0 ? '' : '+'}
                  <span className="text-xs font-normal text-gray-400 ml-1">est. fare</span>
                </p>
              </div>
              <button
                onClick={handleConfirm}
                disabled={booking}
                className="bg-cabotel-navy text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-cabotel-blue transition-all active:scale-95 disabled:opacity-60"
              >
                {booking ? '⏳ Finding driver…' : `Confirm ${selectedCar.service}`}
              </button>
            </div>
          ) : (
            <p className="text-center text-sm text-gray-400 py-1">← Select a ride above</p>
          )}
        </div>
      </div>
    </div>
  );
};

const BookingSuccess = ({ car, pickup, dropoff, distance }) => (
  <div className="min-h-screen bg-cabotel-bg flex flex-col items-center justify-center px-6">
    <div className="w-20 h-20 rounded-full bg-cabotel-teal flex items-center justify-center text-white text-4xl mb-4 shadow-card">
      ✓
    </div>
    <h2 className="font-display text-2xl font-bold text-cabotel-navy mb-1">Ride Confirmed!</h2>
    <p className="text-gray-500 text-sm mb-6">Your driver is on the way</p>

    <div className="w-full max-w-sm bg-white rounded-2xl shadow-card p-5 space-y-3 mb-6">
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Service</span>
        <span className="font-bold text-cabotel-navy">{car?.service}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Pickup</span>
        <span className="font-semibold text-cabotel-navy truncate ml-4">{pickup}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Drop-off</span>
        <span className="font-semibold text-cabotel-navy truncate ml-4">{dropoff}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Distance</span>
        <span className="font-semibold text-cabotel-navy">{distance.toFixed(1)} km</span>
      </div>
      <div className="border-t border-gray-100 pt-3 flex justify-between">
        <span className="font-bold text-cabotel-navy">Estimated Fare</span>
        <span className="font-bold text-cabotel-teal text-lg">
          ₹{Math.round((car?.ratePerKm || 12) * (distance || 10))}
        </span>
      </div>
    </div>

    <div className="flex items-center gap-3 bg-cabotel-pale border border-cabotel-light rounded-2xl px-4 py-3 w-full max-w-sm mb-6">
      <span className="text-2xl">🚗</span>
      <div>
        <p className="font-bold text-cabotel-navy text-sm">Driver arriving in {car?.eta}</p>
        <p className="text-xs text-gray-500">Rajesh K. · ⭐ 4.92 · MH 02 AB 1234</p>
      </div>
    </div>

    <Link href="/">
      <button className="bg-cabotel-navy text-white px-8 py-4 rounded-2xl font-bold hover:bg-cabotel-blue transition-all">
        Back to Home
      </button>
    </Link>
  </div>
);

export default Confirm;
