import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../contexts/AuthContext';

const AdicionarDiabetes = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        level: '',
        context: '',
        notes: '',
        measured_at: new Date().toISOString().slice(0, 16)
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.from('glucose_logs').insert([
                {
                    user_id: user.id,
                    level: parseInt(formData.level),
                    context: formData.context,
                    notes: formData.notes,
                    measured_at: new Date(formData.measured_at).toISOString()
                }
            ]);

            if (error) throw error;
            navigate('/diabetes');
        } catch (error) {
            console.error('Error adding glucose log:', error);
            alert('Erro ao salvar registro. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Nova Medição de Glicemia" showBack>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Nível de Glicemia (mg/dL)</label>
                    <input
                        type="number"
                        name="level"
                        required
                        placeholder="Ex: 98"
                        value={formData.level}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Contexto</label>
                    <select
                        name="context"
                        value={formData.context}
                        onChange={handleChange}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            borderRadius: '12px',
                            border: '1px solid #E5E7EB',
                            fontFamily: 'inherit',
                            fontSize: '1rem',
                            backgroundColor: 'white'
                        }}
                    >
                        <option value="">Selecione...</option>
                        <option value="Jejum">Jejum</option>
                        <option value="Pré-prandial (antes da refeição)">Pré-prandial (antes da refeição)</option>
                        <option value="Pós-prandial (depois da refeição)">Pós-prandial (depois da refeição)</option>
                        <option value="Antes de dormir">Antes de dormir</option>
                        <option value="Madrugada">Madrugada</option>
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Data e Hora</label>
                    <input
                        type="datetime-local"
                        name="measured_at"
                        required
                        value={formData.measured_at}
                        onChange={handleChange}
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
                            border: '1px solid #E5E7EB',
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

export default AdicionarDiabetes;
