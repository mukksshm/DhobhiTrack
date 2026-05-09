import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      if (form.username.trim().toLowerCase() === 'admin' && form.password.trim() === 'admin123') {
        localStorage.setItem('dhobitrack_admin_session', 'true');
        navigate('/admin/dashboard');
      } else {
        setError('Invalid admin credentials.');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="auth-page">
      <div className="bg-grid"></div>
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>
      
      <div className="auth-nav">
        <button className="auth-back" onClick={() => navigate('/')}>
          <span className="back-arrow">←</span> Back
        </button>
      </div>

      <div className="auth-container animate-scale-in">
        <div className="auth-glow"></div>
        <div className="auth-header">
          <div className="auth-icon-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </div>
          <h1 className="auth-title">Admin Portal</h1>
          <p className="auth-subtitle">Secure access to the laundry network</p>
        </div>
        
        <div className="admin-hint">
          Access: <span className="highlight">admin</span> / <span className="highlight">admin123</span>
        </div>
        
        {error && <div className="auth-error animate-fade-in">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Username</label>
            <div className="input-wrap">
              <input
                id="admin-username"
                className="form-input"
                type="text"
                placeholder="Enter username"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrap">
              <input
                id="admin-password"
                className="form-input"
                type="password"
                placeholder="Enter password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
          </div>
          
          <button id="admin-login-btn" className="btn-primary auth-submit-btn" type="submit" disabled={loading}>
            <span className="btn-text">{loading ? 'Authenticating...' : 'Access Portal'}</span>
            {!loading && <span className="btn-icon">→</span>}
          </button>
        </form>
      </div>
    </div>
  );
}
