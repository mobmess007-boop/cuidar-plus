import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>Carregando...</div>;
    }

    return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
