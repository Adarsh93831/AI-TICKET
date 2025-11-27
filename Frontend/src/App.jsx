import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/useAuthStore.js';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import { Loader2 } from 'lucide-react';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CreateTicketPage from './pages/CreateTicketPage';
import ProfilePage from './pages/ProfilePage';
import UnauthorizedPage from './pages/unauthorizedPage';
import AdminPage from './pages/AdminPage';
import TicketDetailPage from './pages/TicketDetailPage';
import AssignedTicketsPage from './pages/AssignedTicketsPage';


function App() {
  const { checkAuth, isInitialized, isLoading } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.log("Initial auth check failed:", error.message);
      }
    };
    
    initAuth();
  }, [checkAuth]);

  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/tickets/new" 
            element={
              <ProtectedRoute requiredRoles={['user']}>
                <CreateTicketPage />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/tickets/:id" 
            element={
              <ProtectedRoute>
                <TicketDetailPage />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/assigned-tickets" 
            element={
              <ProtectedRoute requiredRoles={['admin', 'moderator']}>
                <AssignedTicketsPage />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRoles={['admin', 'moderator']}>
                <AdminPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
        
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;

