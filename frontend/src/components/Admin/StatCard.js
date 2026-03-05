import React from 'react';

const StatCard = ({ label, value, color }) => {
  return (
    <div style={{ 
      background: color, 
      flex: 1, 
      padding: '15px', 
      borderRadius: '12px', 
      textAlign: 'center', 
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)' 
    }}>
      <div style={{ 
        fontFamily: 'Playfair Display, serif', 
        fontSize: '1.6rem', 
        color: '#6b5ce7',
        marginBottom: '4px'
      }}>{value}</div>
      <div style={{ 
        fontSize: '0.7rem', 
        color: '#7a7a8c', 
        fontWeight: '600', 
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>{label}</div>
    </div>
  );
};

export default StatCard;