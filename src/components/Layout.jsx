import React from 'react';
import Header from './Header';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Layout = ({ children, title, showBack = false }) => {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header title="Cuidar+" />

            {showBack && (
                <div className="container" style={{ paddingBottom: 0, paddingTop: '1rem' }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: 'var(--text-secondary)',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            padding: 0
                        }}
                    >
                        <ArrowLeft size={20} />
                        Voltar
                    </button>
                </div>
            )}

            <main className="container" style={{ flex: 1, paddingTop: showBack ? '1rem' : '20px' }}>
                {title && <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>{title}</h2>}
                {children}
            </main>
        </div>
    );
};

export default Layout;
