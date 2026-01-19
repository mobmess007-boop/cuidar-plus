import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Shield, Bell, Smartphone, ArrowRight, CheckCircle2 } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleBuy = () => {
        // Here we would link to the Kiwify checkout
        window.location.href = 'https://pay.kiwify.com.br/udQeJ5b';
    };

    return (
        <div style={{
            fontFamily: 'var(--font-family)',
            color: 'var(--text-primary)',
            background: 'white',
            overflowX: 'hidden'
        }}>
            {/* Nav */}
            <nav style={{
                padding: '1.5rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Heart fill="var(--primary-color)" />
                    Cuidar+
                </div>
                <button
                    onClick={() => navigate(user ? '/dashboard' : '/login')}
                    style={{ background: 'transparent', border: 'none', fontWeight: '600', color: 'var(--text-secondary)' }}
                >
                    {user ? 'Ir para o Painel' : 'Entrar'}
                </button>
            </nav>

            {/* Hero */}
            <header style={{
                padding: '4rem 1.5rem',
                textAlign: 'center',
                background: 'linear-gradient(180deg, #EFF6FF 0%, #FFFFFF 100%)',
                position: 'relative'
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{
                        display: 'inline-block',
                        padding: '0.5rem 1rem',
                        background: 'white',
                        borderRadius: '20px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: 'var(--primary-color)',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                        marginBottom: '1.5rem'
                    }}>
                        ✨ O seu assistente de saúde pessoal
                    </div>
                    <h1 style={{ fontSize: '3.5rem', lineHeight: '1.1', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
                        Tranquilidade para você e <span style={{ color: 'var(--primary-color)' }}>sua família.</span>
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
                        O aplicativo mais simples e seguro para controlar medicamentos, pressão e diabetes. Feito pensando em quem precisa de clareza e facilidade.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                            onClick={handleBuy}
                            className="btn-primary"
                            style={{ width: 'auto', padding: '1rem 2rem', fontSize: '1.125rem' }}
                        >
                            Garanta seu Acesso Vitalício
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Features */}
            <section style={{ padding: '6rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Por que escolher o Cuidar+?</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Focado na simplicidade e no que realmente importa.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <FeatureCard
                        icon={<Bell size={32} />}
                        title="Lembretes Inteligentes"
                        desc="Nunca mais esqueça uma dose. O app avisa exatamente o que tomar e quando tomar."
                    />
                    <FeatureCard
                        icon={<Shield size={32} />}
                        title="Histórico Completo"
                        desc="Acompanhe sua pressão e glicemia em gráficos fáceis de ler para mostrar ao médico."
                    />
                    <FeatureCard
                        icon={<Smartphone size={32} />}
                        title="Interface para Idosos"
                        desc="Botões grandes, letras legíveis e navegação intuitiva. Sem complicação."
                    />
                </div>
            </section>

            {/* Social Proof / Pricing */}
            <section style={{ padding: '6rem 1.5rem', background: '#111827', color: 'white', borderRadius: '40px', margin: '0 1.5rem 4rem' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Acesso Vitalício</h2>
                    <div style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        R$ 97<span style={{ fontSize: '1.5rem', opacity: '0.6' }}>,90</span>
                    </div>
                    <p style={{ opacity: '0.6', marginBottom: '3rem' }}>Pagamento único. Sem mensalidades.</p>

                    <ul style={{ textAlign: 'left', display: 'inline-block', marginBottom: '3rem', listStyle: 'none', padding: 0 }}>
                        <ListItem text="Controle de Medicamentos ilimitado" />
                        <ListItem text="Gráficos de Pressão e Diabetes" />
                        <ListItem text="Instalação PWA no celular" />
                        <ListItem text="Suporte prioritário" />
                    </ul>

                    <button
                        onClick={handleBuy}
                        className="btn-primary"
                        style={{ background: '#FFF', color: '#000', padding: '1.25rem 2.5rem', fontSize: '1.25rem' }}
                    >
                        Quero Cuidar da Minha Saúde agora
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: '4rem 1.5rem', borderTop: '1px solid #E5E7EB', textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '1rem' }}>Cuidar+</div>
                <p style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>© 2026 Cuidar+ Saúde Pessoal. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div style={{ padding: '2.5rem', borderRadius: '24px', background: '#F9FAFB', border: '1px solid #F3F4F6' }}>
        <div style={{ color: 'var(--primary-color)', marginBottom: '1.5rem' }}>{icon}</div>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{title}</h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{desc}</p>
    </div>
);

const ListItem = ({ text }) => (
    <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', fontSize: '1.125rem' }}>
        <CheckCircle2 color="#10B981" />
        {text}
    </li>
);

export default LandingPage;
