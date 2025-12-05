import React from 'react';
import { Outlet } from 'react-router-dom';

export const AdminLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-stone-100">
            <Outlet />
        </div>
    );
};
