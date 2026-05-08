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
        s => s.laundryId === form.laundryId.toUpperCase() && s.password === form.password
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
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="auth-back" onClick={() => navigate('/')}>← Back</div>
      <div className="auth-container animate-scale-in">
        <div className="auth-header">
          <h1 className="auth-title">Student Login</h1>
          <p className="auth-subtitle">Check your laundry status anytime</p>
        </div>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Laundry ID (Bag Number)</label>
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
          <div className="form-group">
            <label className="form-label">Password</label>
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
          <button id="student-login-btn" className="btn-primary" type="submit" disabled={loading}>
            {loading ? <span className="btn-spinner"></span> : 'Check My Laundry'}
          </button>
        </form>
        <p className="auth-link-text">
          New here? <Link to="/student/register" className="auth-link">Register your Laundry ID</Link>
        </p>
      </div>
    </div>
  );
}
