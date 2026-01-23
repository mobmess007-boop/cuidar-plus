import React from 'react';
import { useNavigate } from 'react-router-dom';
import LargeButton from '../components/LargeButton';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { Crown, Star, ArrowRight, Activity, Pill, Droplet } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const { isPremium } = useAuth();

    return (
        <Layout>
            {/* O isPremium aqui é apenas para mostrar o selo, a proteção já foi feita pelo PremiumRoute */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success-color)', fontWeight: '600' }}>
                <Star size={20} fill="var(--success-color)" />
                Usuário Premium
            </div>

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
