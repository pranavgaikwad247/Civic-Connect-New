import React from 'react';

const ReportCardSkeleton: React.FC = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border-l-4 border-gray-200 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
      </div>
      <div className="h-3 bg-gray-300 rounded w-1/2 mt-3"></div>
      <div className="flex justify-between items-center mt-4">
        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/6"></div>
      </div>
    </div>
  );
};

export default ReportCardSkeleton;
