import React, { useState } from 'react';
import { ReportCategory, Location } from '../types';
import { useReports } from '../contexts/ReportContext';
import { XIcon, UploadIcon, CrosshairIcon } from './Icons';
import Spinner from './Spinner';

interface ReportFormModalProps {
  onClose: () => void;
}

const ReportFormModal: React.FC<ReportFormModalProps> = ({ onClose }) => {
  const { addReport } = useReports();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ReportCategory>(ReportCategory.Other);
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState<Location>({ type: 'Point' as const, coordinates: [-73.9857, 40.7484] });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  
  const mockImage = 'https://picsum.photos/seed/newreport/800/600';

  const handleLocateMe = () => {
    setIsLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation: Location = {
          type: 'Point',
          coordinates: [longitude, latitude],
        };
        setLocation(newLocation);
        setAddress(`Located at ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        setIsLocating(false);
      },
      (error) => {
        let message = "Could not retrieve location.";
        if (error.code === error.PERMISSION_DENIED) {
            message = "Location permission denied. Please enable it in your browser settings.";
        }
        setLocationError(message);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !address) {
      setError("Please fill out all required fields.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    
    try {
      // FIX: Removed `createdBy` property. It's handled by ReportContext using the authenticated user.
      await addReport({
        title,
        description,
        category,
        address,
        location,
        images: [mockImage],
      });
      onClose();
    } catch (err) {
      setError("Failed to submit the report. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[1000] flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Submit New Report</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ReportCategory)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              {Object.values(ReportCategory).map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address / Location Description</label>
             <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              required
            />
            <button
              type="button"
              onClick={handleLocateMe}
              disabled={isLocating}
              className="mt-2 inline-flex items-center justify-center gap-2 px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 w-full"
            >
              {isLocating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Locating...
                </>
              ) : (
                <>
                  <CrosshairIcon className="w-5 h-5 mr-1" />
                  Use My Current Location
                </>
              )}
            </button>
            {locationError && <p className="mt-2 text-sm text-red-600">{locationError}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Image (Optional)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">Upload a file</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                <p className="text-xs font-semibold text-gray-500">(Feature not implemented in this demo)</p>
              </div>
            </div>
          </div>
          
          {error && <p className="text-sm text-red-600">{error}</p>}
          
          <div className="p-4 border-t bg-gray-50 text-right -m-6 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 mr-2"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Spinner /> : null}
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportFormModal;