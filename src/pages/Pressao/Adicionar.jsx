import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../contexts/AuthContext';

const AdicionarPressao = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        systolic: '',
        diastolic: '',
        pulse: '',
        notes: '',
        measured_at: new Date().toISOString().slice(0, 16)
    });

    const getBPStatus = (sys, dia) => {
        const s = parseInt(sys);
        const d = parseInt(dia);
        if (isNaN(s) || isNaN(d)) return null;
        if (s < 120 && d < 80) return { label: 'Normal', color: '#10B981', desc: 'Nível ideal.' };
        if (s < 130 && d < 80) return { label: 'Elevada', color: '#FBBF24', desc: 'Pressão um pouco acima do ideal.' };
        if (s < 140 || d < 90) return { label: 'Hipertensão Estágio 1', color: '#F59E0B', desc: 'Nível de hipertensão leve.' };
        if (s < 180 || d < 120) return { label: 'Hipertensão Estágio 2', color: '#EF4444', desc: 'Nível de hipertensão moderada/severa.' };
        return { label: 'Crise Hipertensiva', color: '#B91C1C', desc: 'Procure ajuda médica imediatamente!' };
    };

    const bpStatus = getBPStatus(formData.systolic, formData.diastolic);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.from('blood_pressure_logs').insert([
                {
                    user_id: user.id,
                    systolic: parseInt(formData.systolic),
                    diastolic: parseInt(formData.diastolic),
                    pulse: formData.pulse ? parseInt(formData.pulse) : null,
                    notes: formData.notes,
                    measured_at: new Date(formData.measured_at).toISOString()
                }
            ]);

            if (error) throw error;
            navigate('/pressao');
        } catch (error) {
            console.error('Erro ao adicionar registro de pressão:', error);
            alert('Erro ao salvar registro. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Nova Medição" showBack>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {bpStatus && (
                    <div style={{
                        padding: '1rem',
                        borderRadius: '12px',
                        background: `${bpStatus.color}15`,
                        border: `1px solid ${bpStatus.color}`,
                        textAlign: 'center',
                        marginBottom: '0.5rem'
                    }}>
                        <div style={{ color: bpStatus.color, fontWeight: 'bold', fontSize: '1.25rem' }}>
                            {bpStatus.label}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                            {bpStatus.desc}
                        </div>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Sistólica (Máx)</label>
                        <input
                            type="number"
                            name="systolic"
                            required
                            placeholder="120"
                            value={formData.systolic}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid #D1D5DB' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Diastólica (Mín)</label>
                        <input
                            type="number"
                            name="diastolic"
                            required
                            placeholder="80"
                            value={formData.diastolic}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid #D1D5DB' }}
                        />
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Pulso (BPM)</label>
                    <input
                        type="number"
                        name="pulse"
                        placeholder="70"
                        value={formData.pulse}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid #D1D5DB' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Data e Hora</label>
                    <input
                        type="datetime-local"
                        name="measured_at"
                        required
                        value={formData.measured_at}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid #D1D5DB' }}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Observações</label>
                    <textarea
                        name="notes"
                        rows="3"
                        value={formData.notes}
                        onChange={handleChange}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '12px',
                            border: '1px solid #D1D5DB',
                            fontFamily: 'inherit',
                            fontSize: '1rem'
                        }}
                    />
                </div>

                <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
                    {loading ? 'Salvando...' : 'Salvar Medição'}
                </button>
            </form>
        </Layout>
    );
};

export default AdicionarPressao;
