import React from 'react';
import { carListData } from '../lib/carList';

const RideSelector = ({ selectedCar, onCarSelect, distance }) => {
  const formatFare = (car) => {
    if (!distance || distance <= 0) {
      return `₹${Math.round(car.ratePerKm * 10 * car.multiplier)}+`;
    }
    return `₹${Math.round(car.ratePerKm * distance)}`;
  };

  return (
    <div className="flex flex-col bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h3 className="font-semibold text-cabotel-navy text-sm">Choose your ride</h3>
        {distance > 0 && (
          <span className="text-xs text-cabotel-blue font-medium bg-cabotel-pale px-2 py-1 rounded-full">
            {distance.toFixed(1)} km
          </span>
        )}
      </div>

      <div className="overflow-y-auto" style={{ maxHeight: '38vh' }}>
        {carListData.map((car) => {
          const isSelected = selectedCar?.id === car.id;
          return (
            <button
              key={car.id}
              onClick={() => onCarSelect(car)}
              className={`w-full flex items-center px-4 py-3 border-b border-gray-50 transition-all ${
                isSelected
                  ? 'bg-cabotel-pale border-l-4 border-l-cabotel-teal'
                  : 'hover:bg-gray-50'
              }`}
            >
              <img src={car.imgUrl} alt={car.service} className="h-14 w-16 object-contain flex-shrink-0" />

              <div className="flex-1 text-left ml-3">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-cabotel-navy text-sm">{car.service}</p>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{car.category}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{car.description}</p>
                <p className="text-xs text-cabotel-teal font-semibold mt-0.5">
                  ⏱ {car.eta} · 👤 up to {car.maxPassengers}
                </p>
              </div>

              <div className="text-right ml-3 flex-shrink-0">
                <p className="font-bold text-cabotel-navy text-base">{formatFare(car)}</p>
                {isSelected && (
                  <div className="mt-1 w-6 h-6 rounded-full bg-cabotel-teal flex items-center justify-center ml-auto">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RideSelector;
