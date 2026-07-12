import React from 'react';
import { Outlet } from 'react-router-dom';
import { SEO } from '../../components/SEO';

export const AdminLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-stone-100">
            <SEO title="Administration" description="Smith Instruments administration area." noIndex />
            <Outlet />
        </div>
    );
};
