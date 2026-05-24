import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

const Map = ({ fromLocation, toLocation, singleLocation, zoom = 3 }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [78.96288, 20.593684],
      zoom,
    });
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    markers.current.forEach((m) => m.remove());
    markers.current = [];

    const addMarker = (coords, color) => {
      const el = document.createElement('div');
      el.style.cssText = `
        width:16px;height:16px;border-radius:50%;
        background:${color};border:3px solid white;
        box-shadow:0 2px 8px rgba(0,0,0,0.3);
      `;
      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat(coords)
        .addTo(map.current);
      markers.current.push(marker);
    };

    if (singleLocation) {
      addMarker(singleLocation, '#00b4d8');
      map.current.flyTo({ center: singleLocation, zoom: 14 });
      return;
    }

    if (fromLocation) addMarker(fromLocation, '#03045e');
    if (toLocation) addMarker(toLocation, '#f77f00');

    if (fromLocation && toLocation) {
      map.current.fitBounds([fromLocation, toLocation], {
        padding: 80,
        maxZoom: 14,
      });
    } else if (fromLocation) {
      map.current.flyTo({ center: fromLocation, zoom: 13 });
    }
  }, [fromLocation, toLocation, singleLocation]);

  return <div ref={mapContainer} className="w-full h-full" />;
};

export default Map;
