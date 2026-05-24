import React, { useState } from 'react';
import Link from 'next/link';

const quickDestinations = [
  { label: 'Home', icon: '🏠' },
  { label: 'Airport', icon: '✈️' },
  { label: 'Office', icon: '🏢' },
  { label: 'Hospital', icon: '🏥' },
];

const MapBelow = () => {
  const [activeTab, setActiveTab] = useState('ride');

  return (
    <div className="bg-white rounded-t-3xl shadow-lg -mt-6 relative z-10 pb-8">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-cabotel-navy tracking-tight">
            cabo<span className="text-cabotel-teal">tel</span>
          </h1>
          <p className="text-xs text-gray-400 font-medium tracking-wide">YOUR RIDE · YOUR STAY</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-cabotel-navy flex items-center justify-center text-white font-bold text-sm shadow-md">
          C
        </div>
      </div>

      {/* Tabs */}
      <div className="flex mx-6 mb-4 bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setActiveTab('ride')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'ride'
              ? 'bg-cabotel-navy text-white shadow-sm'
              : 'text-gray-500 hover:text-cabotel-navy'
          }`}
        >
          🚗 Ride
        </button>
        <button
          onClick={() => setActiveTab('stay')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'stay'
              ? 'bg-cabotel-teal text-white shadow-sm'
              : 'text-gray-500 hover:text-cabotel-teal'
          }`}
        >
          🏨 Stay
        </button>
      </div>

      {activeTab === 'ride' ? (
        <RideSection />
      ) : (
        <StaySection />
      )}
    </div>
  );
};

const RideSection = () => (
  <div className="px-6">
    {/* Main CTA */}
    <Link href="/search">
      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 cursor-pointer hover:border-cabotel-teal hover:bg-cabotel-pale transition-all mb-4 shadow-sm">
        <div className="w-3 h-3 rounded-full bg-cabotel-navy mr-3 flex-shrink-0" />
        <span className="text-gray-400 font-medium flex-1">Where are you going?</span>
        <span className="text-cabotel-teal text-xl">→</span>
      </div>
    </Link>

    {/* Quick Destinations */}
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick destinations</p>
    <div className="grid grid-cols-2 gap-2 mb-4">
      {quickDestinations.map((dest) => (
        <Link key={dest.label} href={`/search?dropoff=${dest.label}`}>
          <div className="flex items-center bg-gray-50 rounded-xl px-3 py-3 cursor-pointer hover:bg-cabotel-pale hover:border-cabotel-teal border border-transparent transition-all">
            <span className="text-xl mr-2">{dest.icon}</span>
            <span className="text-sm font-semibold text-cabotel-navy">{dest.label}</span>
          </div>
        </Link>
      ))}
    </div>

    {/* Ride Types */}
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Ride options</p>
    <div className="flex gap-3 overflow-x-auto pb-2">
      {[
        { label: 'CaboX', emoji: '🚗', sub: 'Economy' },
        { label: 'CaboXL', emoji: '🚙', sub: 'Group' },
        { label: 'CaboLux', emoji: '🖤', sub: 'Luxury' },
        { label: 'CaboSUV', emoji: '🏎️', sub: 'Premium' },
      ].map((t) => (
        <Link key={t.label} href="/search">
          <div className="flex-shrink-0 flex flex-col items-center bg-gray-50 rounded-2xl px-4 py-3 cursor-pointer hover:bg-cabotel-pale border border-transparent hover:border-cabotel-teal transition-all w-20">
            <span className="text-2xl">{t.emoji}</span>
            <span className="text-xs font-bold text-cabotel-navy mt-1">{t.label}</span>
            <span className="text-[10px] text-gray-400">{t.sub}</span>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

const StaySection = () => (
  <div className="px-6">
    {/* Main CTA */}
    <Link href="/hotel">
      <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 cursor-pointer hover:border-cabotel-teal hover:bg-cabotel-pale transition-all mb-4 shadow-sm">
        <span className="text-xl mr-3">🔍</span>
        <span className="text-gray-400 font-medium flex-1">Search hotels & resorts</span>
        <span className="text-cabotel-teal text-xl">→</span>
      </div>
    </Link>

    {/* Popular Destinations */}
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Popular destinations</p>
    <div className="grid grid-cols-3 gap-2 mb-4">
      {[
        { city: 'Goa', emoji: '🌊' },
        { city: 'Jaipur', emoji: '🏯' },
        { city: 'Shimla', emoji: '🏔️' },
        { city: 'Mumbai', emoji: '🌆' },
        { city: 'Delhi', emoji: '🕌' },
        { city: 'Bengaluru', emoji: '🌳' },
      ].map((d) => (
        <Link key={d.city} href={`/hotel?location=${d.city}`}>
          <div className="flex flex-col items-center bg-gray-50 rounded-xl py-3 cursor-pointer hover:bg-cabotel-pale border border-transparent hover:border-cabotel-teal transition-all">
            <span className="text-2xl">{d.emoji}</span>
            <span className="text-xs font-semibold text-cabotel-navy mt-1">{d.city}</span>
          </div>
        </Link>
      ))}
    </div>

    {/* Promo Banner */}
    <div className="bg-gradient-to-r from-cabotel-navy to-cabotel-blue rounded-2xl p-4 text-white">
      <p className="text-xs font-semibold text-cabotel-light uppercase tracking-wide">Limited offer</p>
      <p className="font-display font-bold text-lg leading-tight mt-0.5">20% off your first hotel booking</p>
      <p className="text-xs text-cabotel-pale mt-1">Use code: CABOTEL20</p>
    </div>
  </div>
);

export default MapBelow;
