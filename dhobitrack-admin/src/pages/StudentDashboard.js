import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const STATUSES = [
  { key: 'received', label: 'Received', icon: '🔄', color: 'received', desc: 'Your laundry has been received by the laundry service.' },
  { key: 'washing', label: 'Washing', icon: '🧼', color: 'washing', desc: 'Your clothes are currently being washed.' },
  { key: 'ready', label: 'Ready for Pickup', icon: '✅', color: 'ready', desc: 'Your laundry is clean and ready to collect!' },
];

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const s = localStorage.getItem('dhobitrack_current_student');
    if (!s) { navigate('/student/login'); return; }
    const parsed = JSON.parse(s);
    setStudent(parsed);
    const all = JSON.parse(localStorage.getItem('dhobitrack_orders') || '[]');
    const myOrder = all.find(o => o.laundryId === parsed.laundryId);
    setOrder(myOrder || null);

    // Polling: re-check every 10s in case admin updates
    const interval = setInterval(() => {
      const fresh = JSON.parse(localStorage.getItem('dhobitrack_orders') || '[]');
      const updated = fresh.find(o => o.laundryId === parsed.laundryId);
      setOrder(updated || null);
    }, 10000);
    return () => clearInterval(interval);
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('dhobitrack_current_student');
    navigate('/');
  };

  const currentStatusIndex = order?.status ? STATUSES.findIndex(s => s.key === order.status) : -1;
  const currentStatus = currentStatusIndex >= 0 ? STATUSES[currentStatusIndex] : null;

  if (!student) return null;

  return (
    <div className="dashboard-page">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <nav className="dash-nav">
        <div className="nav-logo">
          <span className="logo-icon">🧺</span>
          <span className="logo-text">DhobhiTrack</span>
        </div>
        <div className="nav-right">
          <div className="nav-user">
            <div className="nav-avatar">{student.name.charAt(0).toUpperCase()}</div>
            <div>
              <div className="nav-username">{student.name}</div>
              <div className="nav-room">{student.laundryId}</div>
            </div>
          </div>
          <button className="btn-logout" onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="student-dashboard-content animate-slide-up">

        {/* Laundry ID Card */}
        <div className="laundry-id-card">
          <div className="lid-label">Your Laundry ID</div>
          <div className="lid-value">{student.laundryId}</div>
          <div className="lid-name">{student.name} · {student.mobile}</div>
        </div>

        {/* Status Display */}
        {!order || order.status === null ? (
          <div className="status-waiting-card animate-scale-in">
            <div className="waiting-icon">⏳</div>
            <h2 className="waiting-title">Awaiting Drop-off</h2>
            <p className="waiting-desc">Your laundry hasn't been received yet. Please drop off your bag and the status will update here.</p>
          </div>
        ) : (
          <div className="status-main-card animate-scale-in">
            <div className="status-current-label">Current Status</div>
            <div className={`status-big-badge status-${currentStatus.color}`}>
              <span className="status-big-icon">{currentStatus.icon}</span>
              <span className="status-big-text">{currentStatus.label}</span>
            </div>
            <p className="status-desc-text">{currentStatus.desc}</p>

            {order.status === 'ready' && (
              <div className="pickup-alert">
                🎉 Your laundry is ready! Head to the laundry room to collect your bag <strong>{student.laundryId}</strong>.
              </div>
            )}

            {/* Progress Steps */}
            <div className="student-progress">
              {STATUSES.map((s, i) => (
                <div key={s.key} className="sp-step">
                  <div className={`sp-dot ${i <= currentStatusIndex ? 'sp-done' : ''} ${i === currentStatusIndex ? 'sp-current' : ''}`}>
                    {i < currentStatusIndex ? '✓' : i === currentStatusIndex ? s.icon : ''}
                  </div>
                  <div className={`sp-label ${i === currentStatusIndex ? 'sp-label-active' : ''}`}>{s.label}</div>
                  {i < STATUSES.length - 1 && (
                    <div className={`sp-line ${i < currentStatusIndex ? 'sp-line-done' : ''}`}></div>
                  )}
                </div>
              ))}
            </div>

            <div className="status-updated">
              Last updated: {new Date(order.updatedAt).toLocaleString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
