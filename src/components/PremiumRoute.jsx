import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PremiumRoute = () => {
    const { user, isPremium, loading } = useAuth();

    // 🧩 PADRÃO DE RENDER (OBRIGATÓRIO)
    // 1. if (loading) mostrar loading
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                gap: '12px'
            }}>
                <div className="spinner" style={{
                    width: '40px',
                    height: '40px',
                    border: '4px solid #f3f3f3',
                    borderTop: '4px solid var(--primary-color)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <p style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Carregando...</p>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    // 2. if (!user) redirecionar para /login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 3. if (!premium) redirecionar para /upgrade (usando / como fallback)
    if (!isPremium) {
        return <Navigate to="/" replace />;
    }

    // 4. senão renderizar conteúdo (dashboard/etc)
    return <Outlet />;
};

export default PremiumRoute;
