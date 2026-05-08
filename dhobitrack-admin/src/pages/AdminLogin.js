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
      if (form.username === 'admin' && form.password === 'admin123') {
        localStorage.setItem('dhobitrack_admin_session', 'true');
        navigate('/admin/dashboard');
      } else {
        setError('Invalid admin credentials.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="auth-page">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="auth-back" onClick={() => navigate('/')}>← Back</div>
      <div className="auth-container animate-scale-in">
        <div className="auth-header">
          <div className="auth-icon">⚙️</div>
          <h1 className="auth-title">Admin Login</h1>
          <p className="auth-subtitle">Access the laundry management panel</p>
        </div>
        <div className="admin-hint">
          <span>🔑</span> Default: <strong>admin</strong> / <strong>admin123</strong>
        </div>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Admin Username</label>
            <input
              id="admin-username"
              className="form-input"
              type="text"
              placeholder="admin"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              id="admin-password"
              className="form-input"
              type="password"
              placeholder="Enter admin password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button id="admin-login-btn" className="btn-primary admin-login-btn" type="submit" disabled={loading}>
            {loading ? <span className="btn-spinner"></span> : 'Login as Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}
