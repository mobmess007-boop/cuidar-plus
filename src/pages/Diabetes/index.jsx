import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Droplet } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Layout from '../../components/Layout';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import GlucoseChart from './GlucoseChart';

const Diabetes = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, isPremium } = useAuth();
    const navigate = useNavigate();

    const fetchLogs = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('glucose_logs')
                .select('*')
                .eq('user_id', user.id)
                .order('measured_at', { ascending: false });

            if (error) throw error;
            setLogs(data);
        } catch (error) {
            console.error('Error fetching glucose logs:', error.message);
        } finally {
            setLoading(false);
        }
    }, [user.id]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const getStatusColor = (level) => {
        if (level < 70) return 'var(--warning-color)'; // Hypo
        if (level <= 140) return 'var(--success-color)'; // Normal range (simplified)
        return 'var(--secondary-color)'; // Hyper
    };

    return (
        <Layout title="Controle de Diabetes" showBack>
            <div style={{ marginBottom: '1.5rem' }}>
                <button
                    className="btn-primary"
                    onClick={() => {
                        if (!isPremium && logs.length >= 5) {
                            alert('Limite da versão gratuita atingido (5 registros). Faça o upgrade para Premium para adicionar medições ilimitadas!');
                            return;
                        }
                        navigate('/diabetes/adicionar');
                    }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        opacity: (!isPremium && logs.length >= 5) ? 0.7 : 1
                    }}
                >
                    <Plus size={20} />
                    Nova Medição
                </button>
                {!isPremium && logs.length >= 5 && (
                    <p style={{ color: 'var(--secondary-color)', fontSize: '0.875rem', marginTop: '0.5rem', fontWeight: '500' }}>
                        Limite de 5 registros atingido na versão gratuita.
                    </p>
                )}
            </div>

            {/* Chart Section */}
            {logs.length > 0 && (
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Evolução</h3>
                        {!isPremium && (
                            <span style={{ fontSize: '0.75rem', background: 'var(--primary-color)', color: 'white', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                                PREMIUM
                            </span>
                        )}
                    </div>
                    {isPremium ? (
                        <div style={{ height: '300px', width: '100%' }}>
                            <GlucoseChart data={logs} />
                        </div>
                    ) : (
                        <div style={{
                            height: '200px',
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#F3F4F6',
                            borderRadius: '12px',
                            textAlign: 'center',
                            padding: '1rem'
                        }}>
                            <Droplet size={32} style={{ color: 'var(--text-light)', marginBottom: '0.5rem', opacity: 0.5 }} />
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                                Gráficos de evolução estão disponíveis apenas na <strong>Versão Premium</strong>.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* List Section */}
            <div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>Histórico</h3>
                {loading ? (
                    <p>Carregando...</p>
                ) : logs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                        <Droplet size={48} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                        <p>Nenhum registro encontrado.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {logs.map((log) => (
                            <div key={log.id} className="card" style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 0,
                                borderLeft: `4px solid ${getStatusColor(log.level)}`
                            }}>
                                <div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                                        {log.level}
                                        <span style={{ fontSize: '0.875rem', fontWeight: 'normal', color: 'var(--text-secondary)', marginLeft: '4px' }}>mg/dL</span>
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                        {format(new Date(log.measured_at), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                                    </div>
                                    {log.context && (
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginTop: '2px', fontStyle: 'italic' }}>
                                            {log.context}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Diabetes;
