
import React from 'react';
import { Report, ReportStatus, ReportCategory } from '../types';
import { XIcon, MapPinIcon, UpvoteIcon, AlertTriangleIcon, TagIcon } from './Icons';

const getStatusStyles = (status: ReportStatus): string => {
    switch (status) {
        case ReportStatus.Open: return 'bg-blue-100 text-blue-800';
        case ReportStatus.InProgress: return 'bg-yellow-100 text-yellow-800';
        case ReportStatus.Resolved: return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

const getCategoryStyles = (category: ReportCategory): string => {
    switch (category) {
        case ReportCategory.Pothole: return 'bg-stone-200 text-stone-800';
        case ReportCategory.Garbage: return 'bg-lime-200 text-lime-800';
        case ReportCategory.WaterLeak: return 'bg-sky-200 text-sky-800';
        case ReportCategory.Graffiti: return 'bg-purple-200 text-purple-800';
        case ReportCategory.BrokenStreetlight: return 'bg-amber-200 text-amber-800';
        case ReportCategory.FallenTree: return 'bg-green-200 text-green-800';
        default: return 'bg-gray-200 text-gray-800';
    }
}

const getPriorityStyles = (score: number): { bg: string, text: string } => {
    if (score >= 80) return { bg: 'bg-red-100', text: 'text-red-800' };
    if (score >= 60) return { bg: 'bg-orange-100', text: 'text-orange-800' };
    if (score >= 40) return { bg: 'bg-yellow-100', text: 'text-yellow-800' };
    return { bg: 'bg-green-100', text: 'text-green-800' };
}

// FIX: Defined the missing ReportDetailModalProps interface.
interface ReportDetailModalProps {
  report: Report;
  onClose: () => void;
}

const ReportDetailModal: React.FC<ReportDetailModalProps> = ({ report, onClose }) => {
  const daysAgo = Math.round((new Date().getTime() - report.createdAt.getTime()) / (1000 * 60 * 60 * 24));
  const timeAgo = new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(-daysAgo, 'day');
  const priorityStyles = getPriorityStyles(report.aiScore);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">{report.title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                <XIcon className="w-6 h-6" />
            </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    {report.images.length > 0 && (
                        <img src={report.images[0]} alt={report.title} className="rounded-lg w-full h-auto object-cover mb-4" />
                    )}
                    <h3 className="font-semibold text-lg mb-2">Details</h3>
                    <div className="space-y-3 text-gray-700">
                        <div className="flex items-center"><MapPinIcon className="w-5 h-5 mr-2 text-gray-500" /><span>{report.address}</span></div>
                        <div className="flex items-center"><TagIcon className="w-5 h-5 mr-2 text-gray-500" /><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getCategoryStyles(report.category)} capitalize`}>{report.category.replace('-', ' ')}</span></div>
                        <div className="flex items-center"><UpvoteIcon className="w-5 h-5 mr-2 text-gray-500" /><span>{report.upvotes} Upvotes</span></div>
                         <div className="flex items-center"><span className={`px-2 py-1 text-sm font-semibold rounded-full ${getStatusStyles(report.status)} capitalize`}>{report.status}</span><span className="ml-2 text-gray-500 text-sm">- Reported {timeAgo}</span></div>
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold text-lg mb-2">Description</h3>
                    <p className="text-gray-600 mb-4 bg-gray-50 p-3 rounded-md">{report.description}</p>
                    
                    <h3 className="font-semibold text-lg mb-2">AI Assessment</h3>
                    <div className={`p-4 rounded-lg border-l-4 ${priorityStyles.bg} border-current`}>
                         <div className="flex items-center mb-2">
                             <AlertTriangleIcon className={`w-6 h-6 mr-2 ${priorityStyles.text}`} />
                             <span className={`font-bold text-xl ${priorityStyles.text}`}>Priority Score: {report.aiScore}</span>
                         </div>
                         <p className={`text-sm ${priorityStyles.text}`}>{report.aiSummary}</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="p-4 border-t bg-gray-50 text-right">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailModal;
