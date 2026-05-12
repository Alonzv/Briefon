export default function ExportButton({ onClick, isLoading, large }) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: large ? '14px 32px' : '8px 18px',
        borderRadius: 12,
        background: isLoading ? '#c4b5fd' : 'linear-gradient(135deg, #8A10EB, #a855f7)',
        color: 'white',
        fontWeight: 600,
        fontSize: large ? 16 : 14,
        border: 'none',
        cursor: isLoading ? 'not-allowed' : 'pointer',
        boxShadow: isLoading ? 'none' : '0 4px 14px rgba(138,16,235,0.3)',
        transition: 'all 0.2s',
        fontFamily: 'inherit',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => { if (!isLoading) e.currentTarget.style.boxShadow = '0 6px 20px rgba(138,16,235,0.45)' }}
      onMouseLeave={e => { if (!isLoading) e.currentTarget.style.boxShadow = '0 4px 14px rgba(138,16,235,0.3)' }}
    >
      {isLoading ? (
        <>
          <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          מייצא...
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7,10 12,15 17,10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          ייצוא ל-PDF
        </>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </button>
  )
}
