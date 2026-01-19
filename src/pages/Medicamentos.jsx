import React from 'react';
import Header from '../components/Header';

const Medicamentos = () => (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
        <Header title="Medicamentos" />
        <div className="container">
            <div className="card">
                <h2>Seus Medicamentos</h2>
                <p style={{ marginTop: '10px', color: 'var(--text-muted)' }}>
                    Lista de medicamentos será exibida aqui.
                </p>
            </div>
            <button className="large-button" style={{
                width: '100%',
                padding: '20px',
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                borderRadius: '12px',
                marginTop: '20px'
            }}>
                + Adicionar Novo
            </button>
        </div>
    </div>
);

export default Medicamentos;
