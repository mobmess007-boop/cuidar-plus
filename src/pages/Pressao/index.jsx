import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Layout from '../../components/Layout';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import BPChart from './BPChart';

const Pressao = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    const fetchLogs = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('blood_pressure_logs')
                .select('*')
                .eq('user_id', user.id)
                .order('measured_at', { ascending: false });

            if (error) throw error;
            setLogs(data);
        } catch (error) {
            console.error('Error fetching BP logs:', error.message);
        } finally {
            setLoading(false);
        }
    }, [user.id]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const getStatusColor = (systolic, diastolic) => {
        if (systolic < 120 && diastolic < 80) return 'var(--success-color)';
        if (systolic >= 140 || diastolic >= 90) return 'var(--secondary-color)';
        return 'var(--warning-color)';
    };

    return (
        <Layout title="Pressão Arterial" showBack>
            <div style={{ marginBottom: '1.5rem' }}>
                <button
                    className="btn-primary"
                    onClick={() => navigate('/pressao/adicionar')}
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
                        <BPChart data={logs} />
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
                        <Activity size={48} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
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
                                borderLeft: `4px solid ${getStatusColor(log.systolic, log.diastolic)}`
                            }}>
                                <div>
                                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                                        {log.systolic}/{log.diastolic}
                                        <span style={{ fontSize: '0.875rem', fontWeight: 'normal', color: 'var(--text-secondary)', marginLeft: '4px' }}>mmHg</span>
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                        {format(new Date(log.measured_at), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                                    </div>
                                    {log.pulse && (
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginTop: '2px' }}>
                                            Pulso: {log.pulse} bpm
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

export default Pressao;
