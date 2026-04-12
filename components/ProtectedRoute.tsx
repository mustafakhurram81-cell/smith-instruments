import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';

export const ProtectedRoute: React.FC = () => {
    const { session, userRole } = useAuth();

    if (!session) {
        return <Navigate to="/admin/login" replace />;
    }

    // Only allow users with an admin or manager role
    if (!userRole || (userRole !== 'admin' && userRole !== 'manager')) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};
