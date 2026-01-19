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
    const { user } = useAuth();
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
                    onClick={() => navigate('/diabetes/adicionar')}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                    <Plus size={20} />
                    Nova Medição
                </button>
            </div>

            {/* Chart Section */}
            {logs.length > 0 && (
                <div className="card">
                    <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>Evolução</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <GlucoseChart data={logs} />
                    </div>
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
