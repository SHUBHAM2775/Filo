export default function ConfirmModal({ open, onClose, onConfirm, title, message, confirmText = "Delete", cancelText = "Cancel" }) {
  if (!open) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 2000 }}>
      <div 
        className="modal" 
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '400px',
          width: '90%',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <h3 style={{ 
          marginBottom: '1rem', 
          fontSize: '22px', 
          fontWeight: 'bold', 
          color: 'var(--primary)',
          fontFamily: 'var(--pixel-font)'
        }}>
          {title}
        </h3>
        
        <p style={{ 
          marginBottom: '2rem', 
          fontSize: '16px', 
          color: 'var(--font-color)',
          fontFamily: 'var(--pixel-font)',
          lineHeight: 1.5
        }}>
          {message}
        </p>
        
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          justifyContent: 'center' 
        }}>
          <button 
            className="pixel-btn" 
            onClick={onClose}
            style={{
              backgroundColor: 'var(--surface)',
              color: 'var(--primary)',
              borderColor: 'var(--primary)',
              minWidth: '100px',
            }}
          >
            {cancelText}
          </button>
          <button 
            className="pixel-btn" 
            onClick={handleConfirm}
            style={{
              backgroundColor: '#d32f2f',
              color: 'white',
              borderColor: '#d32f2f',
              minWidth: '100px',
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}