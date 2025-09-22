import React, { useState } from 'react';
import ReportList from './ReportList';
// import ReportMap from './ReportMap'; // Temporarily disabled to prevent crash
import ReportDetailModal from './ReportDetailModal';
import ReportFormModal from './ReportFormModal';
import Header from './Header';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import AdminPanel from './AdminPanel';
import { useReports } from '../contexts/ReportContext';
import { useAuth } from '../contexts/AuthContext';
import { Report } from '../types';
import { MapPinIcon } from './Icons'; // Import icon for placeholder

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { reports } = useReports();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  
  // Modal visibility state
  const [viewMode, setViewMode] = useState<'user' | 'admin'>('user');
  const [isReportFormVisible, setIsReportFormVisible] = useState(false);
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [isRegisterVisible, setIsRegisterVisible] = useState(false);

  const handleSelectReport = (report: Report | null) => {
    setSelectedReport(report);
  };

  const showLogin = () => { setIsRegisterVisible(false); setIsLoginVisible(true); };
  const showRegister = () => { setIsLoginVisible(false); setIsRegisterVisible(true); };

  const renderUserView = () => (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          <div className="lg:col-span-1 h-full">
            <ReportList 
              onSelectReport={handleSelectReport}
              selectedReportId={selectedReport?._id}
            />
          </div>
          <div className="lg:col-span-2 h-full rounded-lg overflow-hidden shadow-md bg-gray-200 flex flex-col justify-center items-center text-center p-4">
            <div className="bg-gray-300 p-6 rounded-lg">
                <MapPinIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700">Map Is Disabled</h3>
                <p className="text-gray-600 mt-2">
                    To enable the interactive map, a valid Mapbox Access Token must be provided in the <strong>ReportMap.tsx</strong> file.
                </p>
                <p className="text-xs text-gray-500 mt-2">The application will not load if the token is invalid.</p>
            </div>
          </div>
        </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header 
        onShowReportForm={() => setIsReportFormVisible(true)}
        onShowLogin={showLogin}
        onShowRegister={showRegister}
        onToggleAdminView={user?.role === 'admin' ? () => setViewMode(prev => prev === 'user' ? 'admin' : 'user') : undefined}
        viewMode={viewMode}
      />
      
      <main className="flex-1 p-6 space-y-6 overflow-hidden">
        {user?.role === 'admin' && viewMode === 'admin' ? (
          <AdminPanel />
        ) : (
          renderUserView()
        )}
      </main>

      {selectedReport && !isReportFormVisible && (
        <ReportDetailModal 
          report={selectedReport} 
          onClose={() => handleSelectReport(null)} 
        />
      )}

      {isReportFormVisible && user && (
        <ReportFormModal onClose={() => setIsReportFormVisible(false)} />
      )}
      
      {isLoginVisible && (
        <LoginModal onClose={() => setIsLoginVisible(false)} onSwitchToRegister={showRegister} />
      )}

      {isRegisterVisible && (
        <RegisterModal onClose={() => setIsRegisterVisible(false)} onSwitchToLogin={showLogin} />
      )}
    </div>
  );
};

export default AdminDashboard;