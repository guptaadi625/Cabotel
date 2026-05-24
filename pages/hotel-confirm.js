import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { hotelListData } from '../lib/hotelList';

const Map = dynamic(() => import('../components/Map'), { ssr: false });

const HotelConfirm = () => {
  const router = useRouter();
  const { id, checkin, checkout, guests, rooms, nights } = router.query;

  const hotel = hotelListData.find((h) => h.id === parseInt(id));
  const numNights = parseInt(nights) || 1;
  const numRooms = parseInt(rooms) || 1;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialReq, setSpecialReq] = useState('');
  const [booking, setBooking] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  if (!hotel) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cabotel-bg px-6">
        <span className="text-5xl mb-4">🏨</span>
        <p className="font-bold text-cabotel-navy mb-2">Hotel not found</p>
        <Link href="/hotel">
          <button className="bg-cabotel-navy text-white px-5 py-2 rounded-xl font-semibold mt-2">
            Back to Hotels
          </button>
        </Link>
      </div>
    );
  }

  const baseTotal = hotel.price * numNights * numRooms;
  const taxes = Math.round(baseTotal * 0.12);
  const total = baseTotal + taxes;

  const handleBook = () => {
    if (!name || !email || !phone) return;
    setBooking(true);
    setTimeout(() => {
      setBooking(false);
      setConfirmed(true);
    }, 2000);
  };

  if (confirmed) {
    return <BookingSuccess hotel={hotel} checkin={checkin} checkout={checkout} guests={guests} rooms={numRooms} nights={numNights} total={total} name={name} />;
  }

  return (
    <div className="min-h-screen bg-cabotel-bg">
      {/* Image + back btn */}
      <div className="relative h-56 w-full">
        <Image src={hotel.imgUrl} alt={hotel.name} layout="fill" objectFit="cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
        <Link href="/hotel-results">
          <button className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white bg-opacity-80 flex items-center justify-center text-cabotel-navy font-bold shadow hover:bg-opacity-100 transition-all">
            ←
          </button>
        </Link>
        <div className="absolute bottom-4 left-4 right-4">
          <span className="bg-cabotel-amber text-cabotel-navy text-xs font-bold px-2 py-1 rounded-full">
            {hotel.tag}
          </span>
          <h1 className="text-white font-display font-bold text-xl mt-1">{hotel.name}</h1>
          <p className="text-white text-xs opacity-80 flex items-center gap-1">
            📍 {hotel.address}
          </p>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Rating & amenities */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-1 bg-cabotel-pale px-2 py-1 rounded-full">
              <span className="text-yellow-400 text-sm">★</span>
              <span className="font-bold text-cabotel-navy text-sm">{hotel.rating}</span>
            </div>
            <span className="text-xs text-gray-400">{hotel.reviewCount.toLocaleString()} reviews</span>
            <span className="text-xs text-gray-400">· {'⭐'.repeat(hotel.stars)}</span>
          </div>
          <p className="text-sm text-gray-600 mb-3">{hotel.description}</p>
          <div className="flex flex-wrap gap-2">
            {hotel.amenities.map((a) => (
              <span key={a} className="text-xs bg-cabotel-pale text-cabotel-blue px-2 py-1 rounded-full font-medium">
                ✓ {a}
              </span>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 pt-3 pb-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Location</p>
          </div>
          <div className="h-40">
            <Map singleLocation={hotel.coordinates} zoom={14} />
          </div>
          <p className="px-4 py-2 text-xs text-gray-500">📍 {hotel.distanceFromCenter} from city center</p>
        </div>

        {/* Booking Summary */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Booking Summary</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Check-in</span>
              <span className="font-semibold text-cabotel-navy">{checkin}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Check-out</span>
              <span className="font-semibold text-cabotel-navy">{checkout}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Duration</span>
              <span className="font-semibold text-cabotel-navy">{numNights} night{numNights !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Guests</span>
              <span className="font-semibold text-cabotel-navy">{guests} guest{guests > 1 ? 's' : ''}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Rooms</span>
              <span className="font-semibold text-cabotel-navy">{numRooms} room{numRooms > 1 ? 's' : ''}</span>
            </div>
            <div className="border-t border-gray-100 pt-2 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">₹{hotel.price.toLocaleString()} × {numNights}n × {numRooms}rm</span>
                <span>₹{baseTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Taxes & fees (12%)</span>
                <span>₹{taxes.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-2">
                <span className="text-cabotel-navy">Total</span>
                <span className="text-cabotel-teal">₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Guest Details */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Guest Details</p>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="As on ID proof"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-cabotel-navy outline-none focus:border-cabotel-teal transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="booking@example.com"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-cabotel-navy outline-none focus:border-cabotel-teal transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Phone *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-cabotel-navy outline-none focus:border-cabotel-teal transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Special Requests (optional)</label>
              <textarea
                value={specialReq}
                onChange={(e) => setSpecialReq(e.target.value)}
                placeholder="Early check-in, extra pillows, etc."
                rows={2}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-cabotel-navy outline-none focus:border-cabotel-teal transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* Cancellation policy */}
        <div className="bg-cabotel-pale border border-cabotel-light rounded-2xl px-4 py-3">
          <p className="text-xs font-bold text-cabotel-navy mb-1">🔄 Free Cancellation</p>
          <p className="text-xs text-gray-600">
            Cancel before 11:59 PM on {checkin} for a full refund. No questions asked.
          </p>
        </div>

        {/* Book Button */}
        <button
          onClick={handleBook}
          disabled={!name || !email || !phone || booking}
          className={`w-full py-4 rounded-2xl font-bold text-base transition-all ${
            name && email && phone && !booking
              ? 'bg-cabotel-orange text-white shadow-card hover:shadow-cardHover hover:bg-orange-500 active:scale-95'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {booking ? '⏳ Confirming your booking…' : `Book Now · ₹${total.toLocaleString()}`}
        </button>

        <p className="text-xs text-center text-gray-400 pb-4">
          By booking you agree to our Terms & Conditions. No hidden fees.
        </p>
      </div>
    </div>
  );
};

const BookingSuccess = ({ hotel, checkin, checkout, guests, rooms, nights, total, name }) => {
  const bookingRef = `CB${Date.now().toString().slice(-6)}`;
  return (
    <div className="min-h-screen bg-cabotel-bg flex flex-col items-center justify-center px-6">
      <div className="w-20 h-20 rounded-full bg-cabotel-teal flex items-center justify-center text-white text-4xl mb-4 shadow-card">
        ✓
      </div>
      <h2 className="font-display text-2xl font-bold text-cabotel-navy mb-1">Booking Confirmed!</h2>
      <p className="text-gray-500 text-sm mb-2">A confirmation has been sent to your email</p>
      <p className="text-xs text-cabotel-teal font-semibold mb-6">Ref: #{bookingRef}</p>

      <div className="w-full max-w-sm bg-white rounded-2xl shadow-card p-5 space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Guest</span>
          <span className="font-bold text-cabotel-navy">{name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Hotel</span>
          <span className="font-semibold text-cabotel-navy">{hotel.name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Check-in</span>
          <span className="font-semibold text-cabotel-navy">{checkin}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Check-out</span>
          <span className="font-semibold text-cabotel-navy">{checkout}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Duration</span>
          <span className="font-semibold text-cabotel-navy">{nights} nights · {rooms} room{rooms > 1 ? 's' : ''}</span>
        </div>
        <div className="border-t border-gray-100 pt-3 flex justify-between">
          <span className="font-bold text-cabotel-navy">Total Paid</span>
          <span className="font-bold text-cabotel-teal text-lg">₹{total.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-cabotel-pale border border-cabotel-light rounded-2xl px-4 py-3 w-full max-w-sm mb-6">
        <span className="text-2xl">🏨</span>
        <div>
          <p className="font-bold text-cabotel-navy text-sm">{hotel.name}</p>
          <p className="text-xs text-gray-500">{hotel.address}</p>
        </div>
      </div>

      <Link href="/">
        <button className="bg-cabotel-navy text-white px-8 py-4 rounded-2xl font-bold hover:bg-cabotel-blue transition-all">
          Back to Home
        </button>
      </Link>
    </div>
  );
};

export default HotelConfirm;
