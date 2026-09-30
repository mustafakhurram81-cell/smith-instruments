import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { legacyTarget } from '../../lib/catalog/legacy';

export const LegacyRedirect: React.FC = () => {
  const { pathname } = useLocation();
  return <Navigate to={legacyTarget(pathname.split('/').filter(Boolean))} replace />;
};
