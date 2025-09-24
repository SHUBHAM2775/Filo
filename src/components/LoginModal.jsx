import { useState } from 'react';

export default function LoginModal({ open, onClose, onLogin, error }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={e => e.stopPropagation()}
        style={{
          minWidth: 380,
          maxWidth: '95vw',
          padding: '3rem 2.5rem 2.5rem 2.5rem',
          borderRadius: 18,
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h2 style={{ fontSize: 32, marginBottom: 8, fontWeight: 'bold', letterSpacing: 1 }}>{isRegister ? 'Register' : 'Login'}</h2>
        <div style={{ color: '#888', fontSize: 16, marginBottom: 28, textAlign: 'center' }}>
          {isRegister ? 'Create a new account to get started.' : 'Welcome back! Please login to continue.'}
        </div>
        <form
          onSubmit={e => {
            e.preventDefault();
            onLogin(email, password, isRegister, username);
          }}
          style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 18 }}
        >
          {isRegister && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className="pixel-input"
              style={{ fontSize: 18, padding: '0.8em 1.2em', marginBottom: 8 }}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="pixel-input"
            style={{ fontSize: 18, padding: '0.8em 1.2em', marginBottom: 8 }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="pixel-input"
            style={{ fontSize: 18, padding: '0.8em 1.2em', marginBottom: 8 }}
          />
          {error && <div className="error-msg" style={{ marginBottom: 8 }}>{error}</div>}
          <button 
            type="submit" 
            className="pixel-btn" 
            style={{ 
              fontSize: 18, 
              padding: '0.7em 0', 
              marginTop: 8, 
              marginBottom: 8,
              background: 'var(--accent)',
              color: 'var(--primary)',
              border: '3px solid var(--primary)',
              borderRadius: '12px',
              fontWeight: 'bold',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              transition: 'all 0.15s ease',
              cursor: 'pointer',
              boxShadow: '0 4px 0 var(--primary), 0 4px 8px rgba(0,0,0,0.2)',
              transform: 'translateY(0)',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--primary)';
              e.target.style.color = 'var(--accent)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 0 var(--accent), 0 6px 12px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'var(--accent)';
              e.target.style.color = 'var(--primary)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 0 var(--primary), 0 4px 8px rgba(0,0,0,0.2)';
            }}
            onMouseDown={(e) => {
              e.target.style.transform = 'translateY(2px)';
              e.target.style.boxShadow = '0 2px 0 var(--primary), 0 2px 4px rgba(0,0,0,0.3)';
              e.target.style.background = '#ff8c42';
              e.target.style.borderColor = '#333';
            }}
            onMouseUp={(e) => {
              e.target.style.background = 'var(--primary)';
              e.target.style.color = 'var(--accent)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 0 var(--accent), 0 6px 12px rgba(0,0,0,0.3)';
              e.target.style.borderColor = 'var(--primary)';
            }}
          >
            {isRegister ? '🚀 Register' : '🔓 Login'}
          </button>
        </form>
        <button
          className="pixel-btn switch-btn"
          style={{ 
            marginTop: 18, 
            fontSize: 16, 
            padding: '0.6em 0',
            background: 'var(--surface)',
            color: 'var(--primary)',
            border: '2px dashed var(--primary)',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'var(--accent)';
            e.target.style.borderStyle = 'solid';
            e.target.style.transform = 'scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'var(--surface)';
            e.target.style.borderStyle = 'dashed';
            e.target.style.transform = 'scale(1)';
          }}
          onMouseDown={(e) => {
            e.target.style.transform = 'scale(0.98)';
            e.target.style.background = '#e0e0e0';
          }}
          onMouseUp={(e) => {
            e.target.style.transform = 'scale(1.02)';
            e.target.style.background = 'var(--accent)';
          }}
          onClick={() => setIsRegister(r => !r)}
        >
          {isRegister ? '← Already have an account? Login' : "→ Don't have an account? Register"}
        </button>
      </div>
    </div>
  );
} 