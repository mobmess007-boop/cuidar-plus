import React from 'react';
import { HeartPulse } from 'lucide-react';

const Logo = ({ size = 24, showText = true, color = 'var(--primary-color)' }) => {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontWeight: 'bold',
            color: color,
            fontSize: size * 0.75
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: size * 1.5,
                height: size * 1.5,
                backgroundColor: '#EFF6FF',
                borderRadius: '12px',
                color: color
            }}>
                <HeartPulse size={size} strokeWidth={2.5} />
            </div>
            {showText && <span style={{ letterSpacing: '-0.02em' }}>Cuidar<span style={{ color: 'var(--secondary-color)' }}>+</span></span>}
        </div>
    );
};

export default Logo;
