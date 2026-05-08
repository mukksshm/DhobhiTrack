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
      if (students.find(s => s.laundryId === form.laundryId)) {
        setError('This Laundry ID is already registered. Please login instead.');
        setLoading(false);
        return;
      }
      if (students.find(s => s.mobile === form.mobile)) {
        setError('This mobile number is already registered.');
        setLoading(false);
        return;
      }
      const newStudent = {
        id: 'STU' + String(students.length + 1).padStart(3, '0'),
        name: form.name,
        mobile: form.mobile,
        laundryId: form.laundryId.toUpperCase(),
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
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="auth-back" onClick={() => navigate('/')}>← Back</div>
      <div className="auth-container animate-scale-in">
        <div className="auth-header">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Register with your laundry bag ID to track status</p>
        </div>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input id="reg-name" className="form-input" type="text" placeholder="e.g. Mukund Sharma"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Mobile Number</label>
            <input id="reg-mobile" className="form-input" type="tel" placeholder="10-digit mobile number"
              value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} required maxLength={10} />
          </div>
          <div className="form-group">
            <label className="form-label">Laundry ID (Bag Number)</label>
            <input id="reg-laundry-id" className="form-input" type="text" placeholder="e.g. BAG-042 or L-204"
              value={form.laundryId} onChange={e => setForm({ ...form, laundryId: e.target.value })} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input id="reg-password" className="form-input" type="password" placeholder="Min 6 characters"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input id="reg-confirm" className="form-input" type="password" placeholder="Repeat password"
                value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} required />
            </div>
          </div>
          <button id="reg-submit-btn" className="btn-primary" type="submit" disabled={loading}>
            {loading ? <span className="btn-spinner"></span> : 'Create Account'}
          </button>
        </form>
        <p className="auth-link-text">
          Already have an account? <Link to="/student/login" className="auth-link">Login here</Link>
        </p>
      </div>
    </div>
  );
}
