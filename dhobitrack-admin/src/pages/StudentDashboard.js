import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const s = localStorage.getItem('dhobitrack_current_student');
    if (!s) { navigate('/student/login'); return; }
    setStudent(JSON.parse(s));
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('dhobitrack_current_student');
    navigate('/');
  };

  if (!student) return null;

  return (
    <div className="dashboard-page">
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

        <div className="status-waiting-card animate-scale-in">
          <div className="waiting-icon">🧾</div>
          <h2 className="waiting-title">Student Details</h2>
          <p className="waiting-desc">
            You are logged in successfully. Laundry status tracking will be added in the next version.
          </p>
        </div>
      </div>
    </div>
  );
}
