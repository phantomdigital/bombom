export default function TickerPreviewPage() {
  const item = (
    <>
      <span style={{ padding: '0 16px', fontSize: 18, color: '#ffffff' }}>
        Frozen Yoghurt{' '}
      </span>
      <span style={{ padding: '0 16px', fontSize: 18, color: '#ffffff' }}>
        Soft Serve{' '}
      </span>
      <span style={{ padding: '0 16px', fontSize: 18, color: '#ffffff' }}>
        Ice cream{' '}
      </span>
    </>
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#91c4ff',
        fontFamily: 'var(--font-sans), sans-serif',
      }}
    >
      <div
        style={{
          width: 600,
          overflow: 'hidden',
          padding: '4px 0',
          background: '#91c4ff',
        }}
      >
        <div
          className="animate-ticker-marquee"
          style={{
            display: 'flex',
            width: 'max-content',
          }}
        >
          <span style={{ display: 'flex', whiteSpace: 'nowrap' }}>{item}</span>
          <span style={{ display: 'flex', whiteSpace: 'nowrap' }}>{item}</span>
        </div>
      </div>
    </div>
  );
}
