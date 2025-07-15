import { useState } from 'react';

export default function LoginModal({ open, onClose, onLogin, error }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{isRegister ? 'Register' : 'Login'}</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            onLogin(email, password, isRegister, username);
          }}
        >
          {isRegister && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className="pixel-input"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="pixel-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="pixel-input"
          />
          {error && <div className="error-msg">{error}</div>}
          <button type="submit" className="pixel-btn">
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>
        <button
          className="pixel-btn switch-btn"
          onClick={() => setIsRegister(r => !r)}
        >
          {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
        </button>
      </div>
    </div>
  );
} 