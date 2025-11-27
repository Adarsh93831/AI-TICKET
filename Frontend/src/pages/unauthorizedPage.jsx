import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, Home } from 'lucide-react';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <Shield className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900">Access Denied</h2>
          <p className="mt-4 text-lg text-gray-600">
            You don't have permission to access this page.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            This page requires special privileges that your account doesn't have.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            What you can do:
          </h3>
          <ul className="text-sm text-gray-600 space-y-2 text-left">
            <li className="flex items-center">
              <span className="h-1.5 w-1.5 bg-blue-600 rounded-full mr-2"></span>
              Contact your administrator for access
            </li>
            <li className="flex items-center">
              <span className="h-1.5 w-1.5 bg-blue-600 rounded-full mr-2"></span>
              Return to the dashboard
            </li>
            <li className="flex items-center">
              <span className="h-1.5 w-1.5 bg-blue-600 rounded-full mr-2"></span>
              Check if you're logged in with the correct account
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Home className="h-4 w-4 mr-2" />
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;