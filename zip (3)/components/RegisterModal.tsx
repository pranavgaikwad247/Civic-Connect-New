import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { XIcon } from './Icons';
import Spinner from './Spinner';

interface RegisterModalProps {
    onClose: () => void;
    onSwitchToLogin: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ onClose, onSwitchToLogin }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await register(name, email, password);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to register.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[1000] flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
        <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                <XIcon className="w-6 h-6" />
            </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="register-name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              id="register-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              required
            />
          </div>
          <div>
            <label htmlFor="register-email" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              id="register-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              required
            />
          </div>
          <div>
            <label htmlFor="register-password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="register-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              required
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
           <div className="text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <button type="button" onClick={onSwitchToLogin} className="font-medium text-blue-600 hover:text-blue-500">
              Log in
            </button>
          </div>
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
              {isSubmitting && <Spinner />}
              {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;