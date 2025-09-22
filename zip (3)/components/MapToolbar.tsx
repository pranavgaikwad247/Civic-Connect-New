
import React from 'react';
import { FocusIcon, PlusIcon, MinusIcon } from './Icons';

interface MapToolbarProps {
  onRecenter: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

const MapToolbar: React.FC<MapToolbarProps> = ({ onRecenter, onZoomIn, onZoomOut }) => {
  const buttonClass = "bg-white p-2 rounded-md shadow-md hover:bg-gray-100 transition-colors text-gray-700";
  return (
    <div className="absolute top-4 left-4 z-[500] flex flex-col gap-2">
      <button onClick={onRecenter} className={buttonClass} aria-label="Recenter map">
        <FocusIcon className="w-5 h-5" />
      </button>
      <button onClick={onZoomIn} className={buttonClass} aria-label="Zoom in">
        <PlusIcon className="w-5 h-5" />
      </button>
      <button onClick={onZoomOut} className={buttonClass} aria-label="Zoom out">
        <MinusIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default MapToolbar;
