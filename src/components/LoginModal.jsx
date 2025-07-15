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
          <button type="submit" className="pixel-btn" style={{ fontSize: 18, padding: '0.7em 0', marginTop: 8, marginBottom: 8 }}>
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>
        <button
          className="pixel-btn switch-btn"
          style={{ marginTop: 18, fontSize: 16, padding: '0.6em 0' }}
          onClick={() => setIsRegister(r => !r)}
        >
          {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
        </button>
      </div>
    </div>
  );
} 