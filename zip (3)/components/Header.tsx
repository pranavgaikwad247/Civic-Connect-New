
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PlusCircleIcon, ShieldCheckIcon } from './Icons';

interface HeaderProps {
  onShowReportForm: () => void;
  onShowLogin: () => void;
  onShowRegister: () => void;
  onToggleAdminView?: () => void;
  viewMode?: 'user' | 'admin';
}

const Header: React.FC<HeaderProps> = ({ 
  onShowReportForm, 
  onShowLogin, 
  onShowRegister,
  onToggleAdminView,
  viewMode
}) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center z-[1001] relative">
      <h1 className="text-2xl font-bold text-gray-800">Civic Connect</h1>
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            {user.role === 'admin' && onToggleAdminView && (
              <button
                onClick={onToggleAdminView}
                className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  viewMode === 'admin' 
                  ? 'bg-indigo-600 text-white border-transparent hover:bg-indigo-700' 
                  : 'bg-white text-indigo-700 border-indigo-300 hover:bg-indigo-50'
                }`}
              >
                <ShieldCheckIcon className="w-5 h-5 mr-2" />
                Admin Panel
              </button>
            )}
            <button
              onClick={onShowReportForm}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusCircleIcon className="w-5 h-5 mr-2" />
              New Report
            </button>
            <div className="text-right">
                <span className="text-gray-800 font-medium block">Welcome, {user.name}</span>
                <button onClick={logout} className="text-xs text-gray-500 hover:text-gray-900">
                    Logout
                </button>
            </div>
          </>
        ) : (
          <>
            <button onClick={onShowLogin} className="text-sm font-medium text-gray-700 hover:text-blue-600">
              Login
            </button>
            <button onClick={onShowRegister} className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
              Sign Up
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
