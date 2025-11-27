import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { 
  Ticket, 
  Home, 
  Plus, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Shield,
  ClipboardList
} from 'lucide-react';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { authUser, logout, isLoading } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  if (authUser?.role === 'user') {
    navigation.splice(1, 0, { name: 'Create Ticket', href: '/tickets/new', icon: Plus });
  }

  if (authUser?.role === 'admin' || authUser?.role === 'moderator') {
    navigation.splice(1, 0, { name: 'Assigned Tickets', href: '/assigned-tickets', icon: ClipboardList });
  }

  if (authUser?.role === 'admin' || authUser?.role === 'moderator') {
    navigation.push({ 
      name: authUser?.role === 'admin' ? 'Admin Panel' : 'Moderator Panel', 
      href: '/admin', 
      icon: Shield 
    });
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - Hidden by default, slides in when open */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50">
          {/* Invisible overlay to close sidebar on click */}
          <div 
            className="fixed inset-0"
            onClick={() => setSidebarOpen(false)} 
          />
          {/* Sidebar panel */}
          <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl">
            <div className="flex h-16 items-center justify-between px-4 border-b">
              <div className="flex items-center space-x-2">
                <Ticket className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">AI Ticket</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main content - Full width since sidebar is hidden */}
      <div>
        {/* Top navigation */}
        <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
          <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
            {/* Hamburger menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 hover:text-gray-900 p-2 rounded-md hover:bg-gray-100 mr-4"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {authUser?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{authUser?.email}</p>
                <p className="text-xs text-gray-500 capitalize">{authUser?.role}</p>
              </div>
            </div>
            
            <div className="ml-auto">
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;