

import React, { useRef, useEffect, useState } from 'react';
import Map, { Marker, Popup, MapRef } from 'react-map-gl';

import { Report } from '../types';
import { MapPinIcon } from './Icons';
import MapToolbar from './MapToolbar';

// For production, this should be an environment variable.
// Using a public demo token which might be rate-limited.
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZmFicmljOCIsImEiOiJjaWc5aTV1ZzUwMDJwdXpseHQ3unstM3EifQ.bKA2MAXvOfHRchIOpysQag';

interface ReportMapProps {
  reports: Report[];
  selectedReport: Report | null;
  onSelectReport: (report: Report | null) => void;
}

const MapErrorPlaceholder: React.FC = () => (
    <div className="w-full h-full bg-gray-200 flex flex-col justify-center items-center text-center p-4">
        <div className="bg-gray-300 p-6 rounded-lg">
            <MapPinIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700">Map Unavailable</h3>
            <p className="text-gray-600 mt-2">
                Could not load map. Please ensure you have a valid Mapbox Access Token.
            </p>
        </div>
    </div>
);


const ReportMap: React.FC<ReportMapProps> = ({ reports, selectedReport, onSelectReport }) => {
  const mapRef = useRef<MapRef>(null);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    if (selectedReport && mapRef.current) {
        mapRef.current.flyTo({
            center: [selectedReport.location.coordinates[0], selectedReport.location.coordinates[1]],
            zoom: 14,
            duration: 1500,
        });
    }
  }, [selectedReport]);

  const handleRecenter = () => {
    if (!mapRef.current || reports.length === 0) return;

    if (reports.length === 1) {
        mapRef.current.flyTo({
            center: reports[0].location.coordinates as [number, number],
            zoom: 14,
            duration: 1000,
        });
        return;
    }

    const longitudes = reports.map(r => r.location.coordinates[0]);
    const latitudes = reports.map(r => r.location.coordinates[1]);
    const sw: [number, number] = [Math.min(...longitudes), Math.min(...latitudes)];
    const ne: [number, number] = [Math.max(...longitudes), Math.max(...latitudes)];

    mapRef.current.fitBounds([sw, ne], { padding: 60, duration: 1000 });
  };
  
  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();

  if (mapError) {
      return <MapErrorPlaceholder />;
  }

  return (
    <Map
      ref={mapRef}
      initialViewState={{
        longitude: -74.0060,
        latitude: 40.7128,
        zoom: 11
      }}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={MAPBOX_TOKEN}
      onError={() => setMapError(true)}
    >
      <MapToolbar 
        onRecenter={handleRecenter}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />
      {reports.map(report => (
        <Marker
          key={report._id}
          longitude={report.location.coordinates[0]}
          latitude={report.location.coordinates[1]}
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            onSelectReport(report);
          }}
        >
          <MapPinIcon className={`w-8 h-8 cursor-pointer ${selectedReport?._id === report._id ? 'text-blue-600 scale-125' : 'text-red-600'} transition-transform`} />
        </Marker>
      ))}

      {selectedReport && (
        <Popup
          longitude={selectedReport.location.coordinates[0]}
          latitude={selectedReport.location.coordinates[1]}
          onClose={() => onSelectReport(null)}
          closeOnClick={false}
          anchor="bottom"
          offset={30}
        >
          <div>
            <h3 className="font-bold">{selectedReport.title}</h3>
            <p className="text-sm">{selectedReport.address}</p>
          </div>
        </Popup>
      )}
    </Map>
  );
};

export default ReportMap;