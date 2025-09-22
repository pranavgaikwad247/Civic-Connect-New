
import React from 'react';
import { Report, ReportStatus } from '../types';
import { UpvoteIcon, MapPinIcon } from './Icons';

interface ReportCardProps {
  report: Report;
  onSelect: () => void;
  isSelected: boolean;
}

const getPriorityStyles = (score: number): { bg: string, text: string, border: string } => {
    if (score >= 80) return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-500' };
    if (score >= 60) return { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-500' };
    if (score >= 40) return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-500' };
    return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-500' };
}

const getStatusStyles = (status: ReportStatus): string => {
    switch (status) {
        case ReportStatus.Open: return 'bg-blue-100 text-blue-800';
        case ReportStatus.InProgress: return 'bg-yellow-100 text-yellow-800';
        case ReportStatus.Resolved: return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onSelect, isSelected }) => {
  const { bg, text, border } = getPriorityStyles(report.aiScore);
  
  // Corrected time ago calculation
  const daysAgo = Math.round((new Date().getTime() - report.createdAt.getTime()) / (1000 * 60 * 60 * 24));
  const timeAgo = new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(-daysAgo, 'day');


  return (
    <div
      onClick={onSelect}
      className={`p-4 bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer border-l-4 ${isSelected ? `ring-2 ring-blue-500 ${border}` : border}`}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-gray-800 text-lg mb-1 pr-2 flex-1">{report.title}</h3>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${bg} ${text}`}>
            Priority: {report.aiScore}
        </div>
      </div>
      <div className="flex items-center text-sm text-gray-500 mt-2">
        <MapPinIcon className="w-4 h-4 mr-1"/>
        <span>{report.address}</span>
      </div>
      <div className="flex justify-between items-center mt-3 text-sm">
        <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyles(report.status)} capitalize`}>
                {report.status}
            </span>
            <span className="text-gray-500">{timeAgo}</span>
        </div>
        <div className="flex items-center space-x-1 text-gray-600">
            <UpvoteIcon className="w-5 h-5"/>
            <span className="font-medium">{report.upvotes}</span>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;