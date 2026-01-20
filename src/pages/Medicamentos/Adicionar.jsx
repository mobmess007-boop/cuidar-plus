import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../contexts/AuthContext';

const AdicionarMedicamento = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        dosage: '',
        frequency: '',
        notes: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.from('medications').insert([
                {
                    user_id: user.id,
                    name: formData.name,
                    dosage: formData.dosage,
                    frequency: formData.frequency,
                    notes: formData.notes
                }
            ]);

            if (error) throw error;
            navigate('/medicamentos');
        } catch (error) {
            console.error('Erro ao adicionar medicamento:', error);
            alert('Erro ao salvar medicamento. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Novo Medicamento" showBack>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Nome do Medicamento</label>
                    <input
                        type="text"
                        name="name"
                        required
                        placeholder="Ex: Losartana"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Dosagem</label>
                    <input
                        type="text"
                        name="dosage"
                        required
                        placeholder="Ex: 50mg"
                        value={formData.dosage}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Frequência</label>
                    <select
                        name="frequency"
                        required
                        value={formData.frequency}
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
                        <option value="1x ao dia (Manhã)">1x ao dia (Manhã)</option>
                        <option value="1x ao dia (Noite)">1x ao dia (Noite)</option>
                        <option value="A cada 12 horas">A cada 12 horas</option>
                        <option value="A cada 8 horas">A cada 8 horas</option>
                        <option value="A cada 6 horas">A cada 6 horas</option>
                        <option value="A cada 4 horas">A cada 4 horas</option>
                        <option value="Uso contínuo">Uso contínuo</option>
                        <option value="Quando necessário">Quando necessário</option>
                    </select>
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
                    {loading ? 'Salvando...' : 'Salvar Medicamento'}
                </button>
            </form>
        </Layout>
    );
};

export default AdicionarMedicamento;
