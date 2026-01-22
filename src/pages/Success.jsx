import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Success = () => {
    const navigate = useNavigate();
    const { isPremium, refreshProfile } = useAuth();

    useEffect(() => {
        // Tenta atualizar o perfil para ver se o premium já foi ativado via webhook
        const timer = setInterval(() => {
            if (!isPremium && refreshProfile) {
                refreshProfile();
            }
        }, 3000);

        return () => clearInterval(timer);
    }, [isPremium, refreshProfile]);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(180deg, #F0FDF4 0%, #FFFFFF 100%)',
            padding: '1.5rem',
            fontFamily: 'var(--font-family)'
        }}>
            <div style={{
                maxWidth: '480px',
                width: '100%',
                background: 'white',
                padding: '3rem 2rem',
                borderRadius: '24px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                textAlign: 'center',
                border: '1px solid #DCFCE7'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '1.5rem'
                }}>
                    <div style={{
                        padding: '1rem',
                        background: '#DCFCE7',
                        borderRadius: '50%',
                        color: '#16A34A'
                    }}>
                        <CheckCircle2 size={48} />
                    </div>
                </div>

                <h1 style={{
                    fontSize: '1.875rem',
                    fontWeight: '700',
                    color: '#111827',
                    marginBottom: '1rem',
                    letterSpacing: '-0.02em'
                }}>
                    Acesso Premium Ativado!
                </h1>

                <p style={{
                    color: '#4B5563',
                    fontSize: '1.125rem',
                    lineHeight: '1.6',
                    marginBottom: '2rem'
                }}>
                    Obrigado por confiar no <strong>Cuidar+</strong>. Sua assinatura vitalícia foi processada com sucesso.
                </p>

                {!isPremium ? (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        color: '#059669',
                        marginBottom: '2rem',
                        fontSize: '0.875rem',
                        background: '#F0FDF4',
                        padding: '0.75rem',
                        borderRadius: '12px'
                    }}>
                        <Loader2 className="animate-spin" size={18} />
                        Configurando sua conta... (pode levar alguns segundos)
                    </div>
                ) : (
                    <div style={{
                        color: '#059669',
                        marginBottom: '2rem',
                        fontSize: '0.875rem',
                        fontWeight: '600'
                    }}>
                        ✅ Tudo pronto! Aproveite seus benefícios.
                    </div>
                )}

                <button
                    onClick={() => navigate('/dashboard')}
                    className="btn-primary"
                    style={{
                        width: '100%',
                        padding: '1rem',
                        fontSize: '1.125rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                    }}
                >
                    Ir para o meu Painel
                    <ArrowRight size={20} />
                </button>

                <p style={{
                    marginTop: '1.5rem',
                    fontSize: '0.875rem',
                    color: '#9CA3AF'
                }}>
                    Dica: Você pode instalar o app na tela inicial do seu celular.
                </p>
            </div>
        </div>
    );
};

export default Success;
