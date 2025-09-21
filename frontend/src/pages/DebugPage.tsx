import React from 'react';
import { useAppSelector } from '../hooks/redux';

const DebugPage: React.FC = () => {
  const authState = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Debug Information</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Authentication State</h2>
          <div className="space-y-2">
            <p><strong>Is Authenticated:</strong> {authState.isAuthenticated ? 'Yes' : 'No'}</p>
            <p><strong>Is Loading:</strong> {authState.isLoading ? 'Yes' : 'No'}</p>
            <p><strong>Error:</strong> {authState.error || 'None'}</p>
            <p><strong>User:</strong> {authState.user ? JSON.stringify(authState.user, null, 2) : 'None'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Local Storage</h2>
          <div className="space-y-2">
            <p><strong>Access Token:</strong> {localStorage.getItem('accessToken') ? 'Present' : 'Not found'}</p>
            <p><strong>Refresh Token:</strong> {localStorage.getItem('refreshToken') ? 'Present' : 'Not found'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Environment Variables</h2>
          <div className="space-y-2">
            <p><strong>API Base URL:</strong> {import.meta.env.VITE_API_BASE_URL}</p>
            <p><strong>Google Client ID:</strong> {import.meta.env.VITE_GOOGLE_CLIENT_ID ? 'Set' : 'Not set'}</p>
            <p><strong>Node Environment:</strong> {import.meta.env.VITE_NODE_ENV}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-x-4">
            <button 
              onClick={() => window.location.href = '/login'}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Go to Login
            </button>
            <button 
              onClick={() => window.location.href = '/signup'}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Go to Signup
            </button>
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              Go to Dashboard
            </button>
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Clear Storage & Reload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;
