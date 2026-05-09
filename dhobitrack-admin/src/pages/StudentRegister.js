import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function StudentRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', mobile: '', laundryId: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.mobile.length < 10) { setError('Enter a valid 10-digit mobile number.'); return; }
    setLoading(true);
    setTimeout(() => {
      const students = JSON.parse(localStorage.getItem('dhobitrack_students') || '[]');
      if (students.find(s => s.laundryId === form.laundryId.trim().toUpperCase())) {
        setError('This Laundry ID is already registered. Please login instead.');
        setLoading(false);
        return;
      }
      if (students.find(s => s.mobile === form.mobile.trim())) {
        setError('This mobile number is already registered.');
        setLoading(false);
        return;
      }
      const newStudent = {
        id: 'STU' + String(students.length + 1).padStart(3, '0'),
        name: form.name.trim(),
        mobile: form.mobile.trim(),
        laundryId: form.laundryId.trim().toUpperCase(),
        password: form.password,
        createdAt: new Date().toISOString(),
      };
      students.push(newStudent);
      localStorage.setItem('dhobitrack_students', JSON.stringify(students));

      const orders = JSON.parse(localStorage.getItem('dhobitrack_orders') || '[]');
      const existing = orders.find(o => o.laundryId === newStudent.laundryId);
      if (!existing) {
        orders.push({
          id: 'ORD' + String(orders.length + 1).padStart(4, '0'),
          laundryId: newStudent.laundryId,
          studentId: newStudent.id,
          studentName: newStudent.name,
          mobile: newStudent.mobile,
          status: null,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem('dhobitrack_orders', JSON.stringify(orders));
      }

      localStorage.setItem('dhobitrack_current_student', JSON.stringify(newStudent));
      navigate('/student/dashboard');
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

      <div className="auth-container auth-container-wide animate-scale-in">
        <div className="auth-glow"></div>
        <div className="auth-header">
          <div className="auth-icon-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Register your laundry bag ID to start tracking</p>
        </div>
        
        {error && <div className="auth-error animate-fade-in">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-wrap">
                <input id="reg-name" className="form-input" type="text" placeholder="e.g. Mukund Sharma"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <div className="input-wrap">
                <input id="reg-mobile" className="form-input" type="tel" placeholder="10-digit mobile number"
                  value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} required maxLength={10} />
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Laundry ID (Bag Number)</label>
            <div className="input-wrap">
              <input id="reg-laundry-id" className="form-input" type="text" placeholder="e.g. BAG-042 or L-204"
                value={form.laundryId} onChange={e => setForm({ ...form, laundryId: e.target.value })} required />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrap">
                <input id="reg-password" className="form-input" type="password" placeholder="Min 6 characters"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-wrap">
                <input id="reg-confirm" className="form-input" type="password" placeholder="Repeat password"
                  value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} required />
              </div>
            </div>
          </div>
          
          <button id="reg-submit-btn" className="btn-primary auth-submit-btn" type="submit" disabled={loading}>
            <span className="btn-text">{loading ? 'Creating...' : 'Create Account'}</span>
            {!loading && <span className="btn-icon">→</span>}
          </button>
        </form>
        <p className="auth-link-text">
          Already have an account? <Link to="/student/login" className="auth-link">Login here</Link>
        </p>
      </div>
    </div>
  );
}
