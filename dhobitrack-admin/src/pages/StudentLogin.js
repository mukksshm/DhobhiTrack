import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function StudentLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ laundryId: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const students = JSON.parse(localStorage.getItem('dhobitrack_students') || '[]');
      const student = students.find(
        s => s.laundryId === form.laundryId.trim().toUpperCase() && s.password === form.password
      );
      if (student) {
        localStorage.setItem('dhobitrack_current_student', JSON.stringify(student));
        navigate('/student/dashboard');
      } else {
        setError('Invalid Laundry ID or password. Please try again.');
        setLoading(false);
      }
    }, 800);
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
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>
          </div>
          <h1 className="auth-title">Student Portal</h1>
          <p className="auth-subtitle">Check your laundry status anytime</p>
        </div>
        
        {error && <div className="auth-error animate-fade-in">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Laundry ID (Bag Number)</label>
            <div className="input-wrap">
              <input
                id="student-laundry-id"
                className="form-input"
                type="text"
                placeholder="e.g. BAG-042 or L-204"
                value={form.laundryId}
                onChange={e => setForm({ ...form, laundryId: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrap">
              <input
                id="student-password"
                className="form-input"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
          </div>
          
          <button id="student-login-btn" className="btn-primary auth-submit-btn" type="submit" disabled={loading}>
            <span className="btn-text">{loading ? 'Authenticating...' : 'Check My Laundry'}</span>
            {!loading && <span className="btn-icon">→</span>}
          </button>
        </form>
        <p className="auth-link-text">
          New here? <Link to="/student/register" className="auth-link">Register your Laundry ID</Link>
        </p>
      </div>
    </div>
  );
}
