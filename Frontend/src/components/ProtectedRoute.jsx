import {Navigate,useLocation} from 'react-router-dom';
import {useAuthStore} from '../store/useAuthStore.js'

const ProtectedRoute = ({children, requiredRoles=[]})=>{
    const {isAuthenticated,authUser,isInitialized} = useAuthStore();
    const location = useLocation();

    console.log('🛡️ ProtectedRoute check:', {
        isInitialized,
        isAuthenticated,
        authUser: authUser?.email,
        currentPath: location.pathname
    });

    if (!isInitialized) {
        console.log('⏳ Not initialized yet, showing loading...');
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        console.log('🚫 Not authenticated, redirecting to login');
        return <Navigate to="/login" state={{ from: location }} replace/>;
    }

    if (requiredRoles.length > 0 && !requiredRoles.includes(authUser?.role)) {
        console.log('🚫 Insufficient permissions, redirecting to unauthorized');
        return <Navigate to="/unauthorized" replace />;
    }

    console.log('✅ Access granted');
    return children;
}

export default ProtectedRoute;