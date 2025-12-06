import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';

export const ProtectedRoute: React.FC = () => {
    const { session } = useAuth();

    if (!session) {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
};
