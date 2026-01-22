import React from 'react';
import { useNavigate } from 'react-router-dom';
import LargeButton from '../components/LargeButton';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { Crown, Star, ArrowRight, Activity, Pill, Droplet } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const { isPremium, user } = useAuth();

    return (
        <Layout>
            {!isPremium && (
                <div style={{
                    background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    color: 'white',
                    marginBottom: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)',
                    transition: 'all 0.3s ease'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '12px' }}>
                            <Crown size={24} color="white" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Versão Gratuita</h3>
                            <p style={{ margin: 0, opacity: 0.9, fontSize: '0.875rem' }}>Libere todas as funções agora!</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            background: 'white',
                            color: '#6366F1',
                            border: 'none',
                            padding: '0.75rem',
                            borderRadius: '12px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        Seja Premium
                        <ArrowRight size={18} />
                    </button>
                </div>
            )}

            {isPremium && (
                <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success-color)', fontWeight: '600' }}>
                    <Star size={20} fill="var(--success-color)" />
                    Usuário Premium
                </div>
            )}

            <div style={{ display: 'grid', gap: '1rem' }}>
                <LargeButton
                    icon={Activity}
                    label="Pressão Arterial"
                    onClick={() => navigate('/pressao')}
                    color="var(--secondary-color)"
                />
                <LargeButton
                    icon={Pill}
                    label="Medicamentos"
                    onClick={() => navigate('/medicamentos')}
                    color="var(--primary-color)"
                />
                <LargeButton
                    icon={Droplet}
                    label="Diabetes"
                    onClick={() => navigate('/diabetes')}
                    color="var(--success-color)"
                />
            </div>
        </Layout>
    );
};

export default Dashboard;
