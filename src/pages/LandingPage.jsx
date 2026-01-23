import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Shield, Bell, Smartphone, ArrowRight, CheckCircle2 } from 'lucide-react';
import Logo from '../components/Logo';

const LandingPage = () => {
    const navigate = useNavigate();
    const { user, isPremium } = useAuth();

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
                <Logo />
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
                        {(!user || !isPremium) && (
                            <button
                                onClick={handleBuy}
                                className="btn-primary"
                                style={{ width: 'auto', padding: '1rem 2rem', fontSize: '1.125rem' }}
                            >
                                {user ? 'Upgrade para Premium' : 'Garantir meu Acesso Vitalício'}
                                <ArrowRight size={20} />
                            </button>
                        )}

                        <button
                            onClick={() => navigate(user ? '/dashboard' : '/register')}
                            style={{
                                width: 'auto',
                                padding: '1rem 2rem',
                                fontSize: '1.125rem',
                                background: 'white',
                                color: 'var(--primary-color)',
                                border: '2px solid var(--primary-color)',
                                borderRadius: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            {user ? 'Ir para o meu Painel' : 'Começar grátis agora'}
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
            <section id="pricing" style={{ padding: '6rem 1.5rem', background: '#111827', color: 'white', borderRadius: '40px', margin: '0 1.5rem 4rem' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                    <div style={{
                        display: 'inline-block',
                        padding: '0.4rem 1rem',
                        background: 'var(--secondary-color)',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        marginBottom: '1.5rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        🚀 Oferta Especial de Lançamento
                    </div>
                    <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Acesso Vitalício</h2>
                    <p style={{ opacity: '0.8', fontSize: '1.125rem', marginBottom: '2rem', color: '#9CA3AF' }}>
                        Para os primeiros 100 usuários
                    </p>

                    <div style={{ marginBottom: '0.5rem', textDecoration: 'line-through', opacity: '0.5', fontSize: '1.25rem' }}>
                        De R$ 197,00
                    </div>
                    <div style={{ fontSize: '4.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'white' }}>
                        R$ 97<span style={{ fontSize: '1.5rem', opacity: '0.8' }}>,90</span>
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
                        Sim! Quero mais saúde e tranquilidade
                    </button>
                </div>
            </section>

            {/* How it works / Activation */}
            <section style={{ padding: '4rem 1.5rem', maxWidth: '800px', margin: '0 auto' }}>
                <div style={{
                    padding: '3rem',
                    borderRadius: '32px',
                    background: '#F3F4F6',
                    border: '1px solid #E5E7EB'
                }}>
                    <h3 style={{ fontSize: '1.75rem', marginBottom: '2rem', textAlign: 'center' }}>
                        Como funciona o Acesso Premium?
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <StepItem
                            number="1"
                            title="Pagamento Seguro"
                            desc="Você realiza o pagamento único através da nossa parceira Kiwify."
                        />
                        <StepItem
                            number="2"
                            title="E-mail de Confirmação"
                            desc="A Kiwify enviará uma confirmação para o seu e-mail. **Atenção:** Guarde qual e-mail você usou na compra!"
                        />
                        <StepItem
                            number="3"
                            title="Ativação Automática"
                            desc="Ao criar sua conta no Cuidar+ usando o **mesmo e-mail** da compra, seu acesso Premium será liberado instantaneamente."
                        />
                    </div>

                    <div style={{
                        marginTop: '2.5rem',
                        padding: '1rem',
                        background: '#FFFBEB',
                        borderRadius: '12px',
                        border: '1px solid #FDE68A',
                        color: '#92400E',
                        fontSize: '0.875rem'
                    }}>
                        <strong>💡 Dica:</strong> Já tem uma conta gratuita? Sem problemas. Use o mesmo e-mail no checkout da Kiwify e seu perfil será atualizado automaticamente para Premium logo após o pagamento.
                    </div>
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

const StepItem = ({ number, title, desc }) => (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
        <div style={{
            minWidth: '40px',
            height: '40px',
            background: 'var(--primary-color)',
            color: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '1.25rem'
        }}>
            {number}
        </div>
        <div>
            <h4 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>{title}</h4>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1rem' }} dangerouslySetInnerHTML={{ __html: desc.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
        </div>
    </div>
);

export default LandingPage;
