import 'tailwindcss/tailwind.css';
import dynamic from 'next/dynamic';
import MapBelow from '../components/MapBelow';

const Map = dynamic(() => import('../components/Map'), { ssr: false });

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-cabotel-bg">
      {/* Map Section */}
      <div className="h-[45vh] w-full relative">
        <div className="absolute inset-0 gradient-navy opacity-10 z-[1] pointer-events-none" />
        <Map zoom={4} />
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-5 py-2 shadow-md">
          <span className="text-cabotel-navy font-semibold text-sm tracking-wide">
            cabo<span className="text-cabotel-teal font-bold">tel</span>
          </span>
        </div>
      </div>

      {/* Below-map content */}
      <MapBelow />
    </div>
  );
}
