import React from 'react';
import PropTypes from 'prop-types';

const LargeButton = ({ icon: Icon, label, onClick, color }) => {
    const buttonColor = color || 'var(--primary-color)';

    return (
        <button
            onClick={onClick}
            className="large-button"
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                padding: '35px',
                fontSize: '1.8rem',
                fontWeight: 'bold',
                backgroundColor: 'var(--card-bg)',
                color: 'var(--text-color)',
                border: `3px solid ${buttonColor}`,
                borderRadius: '16px',
                gap: '20px',
                marginBottom: '25px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'transform 0.1s, background-color 0.2s'
            }}
            onMouseDown={(e) => e.target.style.transform = 'scale(0.98)'}
            onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
            {Icon && (
                <div style={{
                    background: `${buttonColor}20`,
                    padding: '15px',
                    borderRadius: '50%',
                    display: 'flex'
                }}>
                    <Icon size={48} color={buttonColor} />
                </div>
            )}
            <span>{label}</span>
        </button>
    );
};

LargeButton.propTypes = {
    icon: PropTypes.elementType,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    color: PropTypes.string
};

export default LargeButton;
