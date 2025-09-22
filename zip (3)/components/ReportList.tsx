import React from 'react';
import { Report } from '../types';
import ReportCard from './ReportCard';
import ReportCardSkeleton from './ReportCardSkeleton';
import { useReports } from '../contexts/ReportContext';

interface ReportListProps {
  onSelectReport: (report: Report) => void;
  selectedReportId?: string;
}

const ReportList: React.FC<ReportListProps> = ({ onSelectReport, selectedReportId }) => {
  const { reports, loading } = useReports();

  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-full flex flex-col">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Active Reports</h2>
      <div className="flex-1 overflow-y-auto pr-2 space-y-3">
        {loading && Array.from({ length: 5 }).map((_, index) => <ReportCardSkeleton key={index} />)}
        {!loading && reports.map(report => (
          <ReportCard
            key={report._id}
            report={report}
            onSelect={() => onSelectReport(report)}
            isSelected={report._id === selectedReportId}
          />
        ))}
        {!loading && reports.length === 0 && (
            <div className="text-center py-10 text-gray-500">
                <p>No reports found.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ReportList;
