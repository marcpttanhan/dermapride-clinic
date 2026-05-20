export default function ProcedureLoading() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--cine-paper)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        fontFamily: 'var(--dp-mono)',
        fontSize: '11px',
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: 'var(--dp-teal-700)',
        opacity: 0.7,
      }}>
        Loading…
      </div>
    </div>
  )
}
