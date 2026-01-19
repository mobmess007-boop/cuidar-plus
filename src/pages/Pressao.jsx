import React from 'react';
import Header from '../components/Header';

const Pressao = () => (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
        <Header title="Pressão Arterial" />
        <div className="container">
            <div className="card">
                <h2>Histórico de Pressão</h2>
                <p style={{ marginTop: '10px', color: 'var(--text-muted)' }}>
                    Registros de pressão arterial aparecerão aqui.
                </p>
            </div>
            <button className="large-button" style={{
                width: '100%',
                padding: '20px',
                backgroundColor: 'var(--danger)',
                color: 'white',
                borderRadius: '12px',
                marginTop: '20px'
            }}>
                + Registrar Medição
            </button>
        </div>
    </div>
);

export default Pressao;
