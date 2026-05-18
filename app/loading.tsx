export default function Loading() {
  return (
    <div style={{
      position:       'fixed',
      inset:          0,
      background:     'var(--bg-hero)',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      zIndex:         9999,
    }}>
      {/* Three dots pulse */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {[0, 1, 2].map(i => (
          <span
            key={i}
            style={{
              display:         'block',
              width:           '6px',
              height:          '6px',
              borderRadius:    '50%',
              background:      'var(--project-accent)',
              animation:       `loader-pulse 1.1s ease-in-out ${i * 0.18}s infinite`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes loader-pulse {
          0%, 80%, 100% { opacity: 0.18; transform: scale(0.85); }
          40%            { opacity: 1;    transform: scale(1);    }
        }
      `}</style>
    </div>
  );
}
