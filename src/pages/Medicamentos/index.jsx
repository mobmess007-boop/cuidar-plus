import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pill, Clock, Trash2 } from 'lucide-react';
import Layout from '../../components/Layout';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../contexts/AuthContext';

const Medicamentos = () => {
    const [meds, setMeds] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    const fetchMeds = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('medications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setMeds(data);
        } catch (error) {
            console.error('Error fetching meds:', error.message);
        } finally {
            setLoading(false);
        }
    }, [user.id]);

    useEffect(() => {
        fetchMeds();
    }, [fetchMeds]);

    const handleDelete = async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir este medicamento?')) return;
        try {
            const { error } = await supabase.from('medications').delete().eq('id', id);
            if (error) throw error;
            setMeds(meds.filter(m => m.id !== id));
        } catch (error) {
            console.error('Error deleting med:', error);
            alert('Erro ao excluir.');
        }
    };

    return (
        <Layout title="Meus Medicamentos" showBack>
            <div style={{ marginBottom: '1.5rem' }}>
                <button
                    className="btn-primary"
                    onClick={() => navigate('/medicamentos/adicionar')}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                    <Plus size={20} />
                    Novo Medicamento
                </button>
            </div>

            {loading ? (
                <p>Carregando...</p>
            ) : meds.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    <Pill size={48} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                    <p>Nenhum medicamento cadastrado.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {meds.map((med) => (
                        <div key={med.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 0 }}>
                            <div>
                                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{med.name}</h3>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{med.dosage}</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--primary-color)', fontWeight: '500' }}>
                                    <Clock size={16} />
                                    <span>{med.frequency}</span>
                                </div>
                                {med.notes && <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>{med.notes}</p>}
                            </div>
                            <button
                                onClick={() => handleDelete(med.id)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--secondary-color)',
                                    padding: '0.5rem'
                                }}
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </Layout>
    );
};

export default Medicamentos;
