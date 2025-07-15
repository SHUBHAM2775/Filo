export default function Fab({ onClick }) {
  return (
    <button
      className="fab"
      onClick={onClick}
      style={{
        position: 'fixed',
        right: '2rem',
        bottom: '2rem',
        width: 64,
        height: 64,
        borderRadius: 16,
        fontSize: 36,
        fontWeight: 'bold',
        boxShadow: '4px 4px 0 var(--primary)',
        zIndex: 10,
        border: '2px solid var(--primary)',
        background: 'var(--accent)',
        color: 'var(--primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      }}
      aria-label="Add"
    >
      +
    </button>
  );
} 