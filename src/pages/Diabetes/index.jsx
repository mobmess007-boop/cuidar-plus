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
    const { user, profile } = useAuth();
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
            console.error('Erro ao buscar registros de glicemia:', error.message);
        } finally {
            setLoading(false);
        }
    }, [user.id]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const getGlucoseStatus = (level) => {
        if (level < 70) return { label: 'Hipoglicemia', color: '#EF4444', desc: 'Atenção: Nível de açúcar muito baixo!' };
        if (level <= 140) return { label: 'Normal', color: '#10B981', desc: 'Sua glicemia está em um nível excelente.' };
        if (level <= 199) return { label: 'Elevada', color: '#FBBF24', desc: 'Cuidado: Nível um pouco acima do ideal.' };
        return { label: 'Hiperglicemia', color: '#B91C1C', desc: 'ALERTA: Nível de açúcar muito alto!' };
    };

    const handleShareReport = () => {
        const userName = profile?.full_name || 'Usuário Cuidar+';
        const lastLogs = logs.slice(0, 10);

        let reportText = `📋 *Relatório de Glicemia - Cuidar+*\n`;
        reportText += `👤 Paciente: ${userName}\n`;
        reportText += `📅 Gerado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm")}\n\n`;
        reportText += `*Últimas Medições:*\n`;

        lastLogs.forEach(log => {
            const status = getGlucoseStatus(log.level);
            const date = format(new Date(log.measured_at), "dd/MM/HH:mm");
            const context = log.context ? ` (${log.context})` : '';
            reportText += `- ${date}: ${log.level} mg/dL${context} - ${status.label}\n`;
        });

        reportText += `\n_Gerado pelo aplicativo Cuidar+_`;

        const encodedLink = encodeURIComponent(reportText);
        window.open(`https://wa.me/?text=${encodedLink}`, '_blank');
    };

    const handlePrintPDF = () => {
        window.print();
    };

    return (
        <Layout title="Controle de Diabetes" showBack>
            <div className="no-print">
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    <button
                        className="btn-primary"
                        onClick={() => navigate('/diabetes/adicionar')}
                        style={{
                            flex: '1 1 100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <Plus size={20} />
                        Nova Medição
                    </button>
                    {logs.length > 0 && (
                        <>
                            <button
                                onClick={handleShareReport}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    borderRadius: '12px',
                                    border: '1px solid #E5E7EB',
                                    background: 'white',
                                    color: 'var(--text-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    fontWeight: '600',
                                    fontSize: '0.875rem'
                                }}
                            >
                                <Plus size={18} style={{ transform: 'rotate(45deg)', color: '#25D366' }} />
                                WhatsApp
                            </button>
                            <button
                                onClick={handlePrintPDF}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem',
                                    borderRadius: '12px',
                                    border: '1px solid #E5E7EB',
                                    background: 'white',
                                    color: 'var(--text-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    fontWeight: '600',
                                    fontSize: '0.875rem'
                                }}
                            >
                                <Activity size={18} />
                                PDF / Imprimir
                            </button>
                        </>
                    )}
                </div>

                {/* Chart Section */}
                {logs.length > 0 && (
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Evolução</h3>
                        </div>
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
                            {logs.map((log) => {
                                const status = getGlucoseStatus(log.level);
                                return (
                                    <div key={log.id} className="card" style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: 0,
                                        borderLeft: `4px solid ${status.color}`
                                    }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                                <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                                                    {log.level}
                                                </span>
                                                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>mg/dL</span>
                                                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: status.color, marginLeft: '4px' }}>
                                                    {status.label}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                                {format(new Date(log.measured_at), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                                                {log.context && ` • ${log.context}`}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Printable Content (Only visible in print) */}
            <div className="print-only" style={{ padding: '40px', color: 'black', background: 'white' }}>
                <div style={{ textAlign: 'center', borderBottom: '2px solid #EEE', paddingBottom: '20px', marginBottom: '30px' }}>
                    <h1 style={{ color: '#2563EB', fontSize: '24px', marginBottom: '5px' }}>Cuidar+ Saúde Pessoal</h1>
                    <p style={{ fontSize: '18px', fontWeight: '600' }}>Relatório de Glicemia (Diabetes)</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                    <div>
                        <p><strong>Paciente:</strong> {profile?.full_name || 'Não informado'}</p>
                        <p><strong>E-mail:</strong> {user?.email}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p><strong>Data do Relatório:</strong> {format(new Date(), "dd/MM/yyyy HH:mm")}</p>
                    </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                    <thead>
                        <tr style={{ background: '#F3F4F6' }}>
                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #DDD' }}>Data/Hora</th>
                            <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #DDD' }}>Nível (mg/dL)</th>
                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #DDD' }}>Contexto</th>
                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #DDD' }}>Classificação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log) => {
                            const status = getGlucoseStatus(log.level);
                            return (
                                <tr key={log.id}>
                                    <td style={{ padding: '10px', borderBottom: '1px solid #EEE' }}>
                                        {format(new Date(log.measured_at), "dd/MM/yy HH:mm")}
                                    </td>
                                    <td style={{ padding: '10px', borderBottom: '1px solid #EEE', textAlign: 'center', fontWeight: 'bold' }}>
                                        {log.level}
                                    </td>
                                    <td style={{ padding: '10px', borderBottom: '1px solid #EEE' }}>
                                        {log.context || '-'}
                                    </td>
                                    <td style={{ padding: '10px', borderBottom: '1px solid #EEE', color: status.color, fontWeight: '600' }}>
                                        {status.label}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <div style={{ marginTop: '50px', borderTop: '1px solid #EEE', paddingTop: '20px', fontSize: '12px', color: '#666' }}>
                    <p>* Este relatório é uma ferramenta de acompanhamento pessoal e não substitui o diagnóstico médico profissional.</p>
                </div>
            </div>
        </Layout>
    );
};

export default Diabetes;
