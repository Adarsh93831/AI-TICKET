import { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 text-center">
            <div>
              <AlertTriangle className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900">Something went wrong</h2>
              <p className="mt-4 text-lg text-gray-600">
                We're sorry, but something unexpected happened.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                What you can do:
              </h3>
              <ul className="text-sm text-gray-600 space-y-2 text-left">
                <li className="flex items-center">
                  <span className="h-1.5 w-1.5 bg-blue-600 rounded-full mr-2"></span>
                  Try refreshing the page
                </li>
                <li className="flex items-center">
                  <span className="h-1.5 w-1.5 bg-blue-600 rounded-full mr-2"></span>
                  Go back to the homepage
                </li>
                <li className="flex items-center">
                  <span className="h-1.5 w-1.5 bg-blue-600 rounded-full mr-2"></span>
                  Contact support if the problem persists
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Page
              </button>
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-8 text-left bg-red-50 border border-red-200 rounded-md p-4">
                <summary className="font-medium text-red-900 cursor-pointer">
                  Error Details (Development Only)
                </summary>
                <div className="mt-2 text-sm text-red-700">
                  <p className="font-medium">{this.state.error.toString()}</p>
                  <pre className="mt-2 whitespace-pre-wrap text-xs">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;