import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User } from 'lucide-react';

const Header = ({ title }) => {
    const { signOut, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <header style={{
            backgroundColor: 'white',
            padding: '1rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 50
        }}>
            <div className="container" style={{ margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 0 }}>
                <div>
                    <h1 style={{ fontSize: '1.25rem', color: 'var(--primary-color)', margin: 0 }}>{title || 'Cuidar+'}</h1>
                    {user && <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Olá, {user.email?.split('@')[0]}</span>}
                </div>
                <button
                    onClick={handleLogout}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        padding: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <span style={{ fontSize: '0.875rem' }}>Sair</span>
                    <LogOut size={20} />
                </button>
            </div>
        </header>
    );
};

export default Header;
