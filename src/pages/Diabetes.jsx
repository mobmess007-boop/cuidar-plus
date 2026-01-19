import React from 'react';
import Header from '../components/Header';

const Diabetes = () => (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
        <Header title="Controle de Diabetes" />
        <div className="container">
            <div className="card">
                <h2>Glicemia</h2>
                <p style={{ marginTop: '10px', color: 'var(--text-muted)' }}>
                    Seus registros de glicemia.
                </p>
            </div>
            <button className="large-button" style={{
                width: '100%',
                padding: '20px',
                backgroundColor: '#16A34A',
                color: 'white',
                borderRadius: '12px',
                marginTop: '20px'
            }}>
                + Registrar Glicemia
            </button>
        </div>
    </div>
);

export default Diabetes;
