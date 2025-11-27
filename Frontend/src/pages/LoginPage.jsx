import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Ticket, Chrome } from 'lucide-react';

const LoginPage = () => {
  const { loginWithGoogle, isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <Ticket className="h-12 w-12 text-blue-600" />
            <span className="text-3xl font-bold text-gray-900">AI Ticket</span>
          </div>
          <h2 className="text-xl text-gray-600">
            Intelligent Ticket Management System
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to manage your tickets with AI assistance
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-xl p-8 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 text-center">
              Welcome Back
            </h3>
            <p className="text-sm text-gray-600 text-center">
              Continue with your Google account to access your tickets
            </p>
          </div>

          {/* Google Login Button */}
          <button
            onClick={loginWithGoogle}
            disabled={isLoading}
            className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out"
          >
            <Chrome className="h-5 w-5 mr-3" />
            {isLoading ? 'Signing in...' : 'Continue with Google'}
          </button>

          {/* Features */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">What you can do:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <span className="h-1.5 w-1.5 bg-blue-600 rounded-full mr-2"></span>
                Create and manage support tickets
              </li>
              <li className="flex items-center">
                <span className="h-1.5 w-1.5 bg-blue-600 rounded-full mr-2"></span>
                AI-powered ticket assignment
              </li>
              <li className="flex items-center">
                <span className="h-1.5 w-1.5 bg-blue-600 rounded-full mr-2"></span>
                Track ticket status and progress
              </li>
              <li className="flex items-center">
                <span className="h-1.5 w-1.5 bg-blue-600 rounded-full mr-2"></span>
                Real-time notifications
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default LoginPage;