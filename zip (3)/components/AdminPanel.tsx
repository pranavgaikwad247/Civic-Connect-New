
import React from 'react';
import { useReports } from '../contexts/ReportContext';
import { Report, ReportStatus } from '../types';
import DashboardStats from './DashboardStats';

const AdminPanel: React.FC = () => {
    const { reports, updateReportStatus, loading } = useReports();
    
    const handleStatusChange = (reportId: string, newStatus: ReportStatus) => {
        updateReportStatus(reportId, newStatus);
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            <DashboardStats reports={reports} />

            <div className="flex-1 bg-white p-4 rounded-lg shadow-md overflow-hidden flex flex-col">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Manage All Reports</h2>
                <div className="flex-1 overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading && (
                                <tr><td colSpan={5} className="text-center py-4">Loading reports...</td></tr>
                            )}
                            {!loading && reports.map((report) => (
                                <tr key={report._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{report.title}</div>
                                        <div className="text-sm text-gray-500">{report.address}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{report.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(report.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{report.aiScore}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <select
                                            value={report.status}
                                            onChange={(e) => handleStatusChange(report._id, e.target.value as ReportStatus)}
                                            className="block w-full pl-3 pr-8 py-1.5 text-xs border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                                        >
                                            {Object.values(ReportStatus).map(status => (
                                                <option key={status} value={status}>
                                                    {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
