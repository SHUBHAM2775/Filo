import './App.css';
import { useState, useEffect, useRef } from 'react';
import { UserIcon } from '@heroicons/react/24/solid';
import Clouds from './components/Clouds';
import Birds, { Butterfly } from './components/Birds';
import Fab from './components/Fab';
import LoginModal from './components/LoginModal';
import DataTable from './components/DataTable';
import DataModal from './components/DataModal';
import { useAuth } from './context/AuthContext';
import DayNightToggle from './components/DayNightToggle';

function App() {
  const { user, login, logout } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selected, setSelected] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const [isNight, setIsNight] = useState(false);

  // Session-based auth: use sessionStorage instead of localStorage
  useEffect(() => {
    const stored = sessionStorage.getItem('filo_auth');
    if (stored) {
      const { user, token } = JSON.parse(stored);
      login(user, token);
    }
    // eslint-disable-next-line
  }, []);

  // Set API base URL from environment variable (for Vercel deployment)
  const API_BASE = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    if (!user) return setData([]);
    setLoading(true);
    fetch(`${API_BASE}/api/data`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('filo_auth') ? JSON.parse(sessionStorage.getItem('filo_auth')).token : ''}` },
    })
      .then(res => res.json())
      .then(d => setData(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    document.documentElement.style.setProperty('--bg', isNight ? '#23243a' : '#aee9f7');
    document.documentElement.style.setProperty('--surface', isNight ? '#2d2d3a' : '#fffbe7');
    document.documentElement.style.setProperty('--primary', isNight ? '#ffe066' : '#2d2d2d');
    document.documentElement.style.setProperty('--accent', isNight ? '#b3b3e6' : '#ffb347');
    document.documentElement.style.setProperty('--cloud', isNight ? '#b3b3e6' : '#fff');
    document.documentElement.style.setProperty('--bird', isNight ? '#ffe066' : '#ff6f61');
    document.documentElement.style.setProperty('--font-color', isNight ? '#f5f5f5' : '#2d2d2d');
    document.body.classList.toggle('night', isNight);
  }, [isNight]);

  const handleLogin = async (email, password, isRegister, username) => {
    setLoginError('');
    try {
      const body = isRegister
        ? JSON.stringify({ email, password, username })
        : JSON.stringify({ email, password });
      const res = await fetch(`${API_BASE}/api/auth/${isRegister ? 'register' : 'login'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Auth failed');
      if (isRegister) {
        // After register, auto-login
        await handleLogin(email, password, false);
        return;
      }
      login({ username: data.username, email }, data.token);
      sessionStorage.setItem('filo_auth', JSON.stringify({ user: { username: data.username, email }, token: data.token }));
      setLoginOpen(false);
    } catch (err) {
      setLoginError(err.message);
    }
  };

  // Add new data
  const handleAdd = async (formData) => {
    const res = await fetch(`${API_BASE}/api/data`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('filo_auth') ? JSON.parse(sessionStorage.getItem('filo_auth')).token : ''}`,
      },
      body: formData,
    });
    if (res.ok) {
      const newItem = await res.json();
      setData([newItem, ...data]);
      setModalOpen(false);
    }
  };

  // View data
  const handleSelect = item => {
    setSelected(item);
    setModalMode('view');
    setModalOpen(true);
  };

  // Delete data
  const handleDelete = async id => {
    if (!window.confirm('Delete this item?')) return;
    const res = await fetch(`${API_BASE}/api/data/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${sessionStorage.getItem('filo_auth') ? JSON.parse(sessionStorage.getItem('filo_auth')).token : ''}` },
    });
    if (res.ok) setData(data.filter(d => d._id !== id));
    setModalOpen(false);
  };

  // Dropdown close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  return (
    <div className="app-bg">
      <DayNightToggle isNight={isNight} onToggle={() => setIsNight(n => !n)} />
      <div className="clouds">
        <Clouds />
      </div>
      <div className="birds">
        <Birds />
      </div>
      <div className="app-container">
        <header className="header">
          {!user ? (
            <div className="user-icon" onClick={() => setLoginOpen(true)} title="Login">
              <UserIcon style={{ width: 28, height: 28 }} />
            </div>
          ) : (
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <span
                style={{
                  fontFamily: 'var(--pixel-font)',
                  fontSize: 18,
                  background: 'var(--surface)',
                  border: '2px solid var(--primary)',
                  borderRadius: 10,
                  padding: '0.5em 1.2em',
                  boxShadow: '2px 2px 0 var(--primary)',
                  cursor: 'pointer',
                  userSelect: 'none',
                  display: 'inline-block',
                }}
                onClick={() => setDropdownOpen(v => !v)}
              >
                {user.username}
              </span>
              {dropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '110%',
                    background: 'var(--surface)',
                    border: '2px solid var(--primary)',
                    borderRadius: 10,
                    boxShadow: '2px 2px 0 var(--primary)',
                    minWidth: 120,
                    zIndex: 100,
                  }}
                >
                  <button
                    className="pixel-btn"
                    style={{
                      color: '#d32f2f',
                      borderColor: '#d32f2f',
                      width: '100%',
                      fontWeight: 'bold',
                    }}
                    onClick={() => {
                      sessionStorage.removeItem('filo_auth');
                      logout();
                      setDropdownOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </header>
        {user && (
          <>
            {loading ? (
              <div style={{ textAlign: 'center', marginTop: 40 }}>Loading...</div>
            ) : (
              <DataTable data={data} onSelect={handleSelect} />
            )}
          </>
        )}
      </div>
      {/* Only show FAB if logged in */}
      {user && (
        <Fab onClick={() => { setModalMode('add'); setSelected(null); setModalOpen(true); }} />
      )}
      <LoginModal
        open={loginOpen && !user}
        onClose={() => setLoginOpen(false)}
        onLogin={handleLogin}
        error={loginError}
      />
      <DataModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={modalMode === 'add' ? handleAdd : undefined}
        data={selected}
        mode={modalMode}
      />
      {modalMode === 'view' && selected && (
        <button
          className="pixel-btn"
          style={{ position: 'fixed', left: '50%', bottom: '2rem', transform: 'translateX(-50%)', zIndex: 20 }}
          onClick={() => handleDelete(selected._id)}
        >
          Delete
        </button>
      )}
      </div>
  );
}

export default App;
