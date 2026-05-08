import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="nav-logo">
          <span className="logo-icon">🧺</span>
          <span className="logo-text">DhobhiTrack</span>
        </div>
      </nav>

      <main className="landing-hero">
        <h1 className="hero-title">
          Hostel Laundry Tracker
        </h1>
        <p className="hero-subtitle">
          A small website to register your laundry bag and check if it is received, washing, or ready.
        </p>

        <div className="portal-cards">
          <div className="portal-card" onClick={() => navigate('/student/login')} id="student-portal-card">
            <div className="portal-icon">🎓</div>
            <h2 className="portal-title">Student Portal</h2>
            <p className="portal-desc">Login with your laundry ID and see your current status.</p>
            <button className="portal-btn student-btn">
              Student Login
            </button>
          </div>

          <div className="portal-card admin-card" onClick={() => navigate('/admin/login')} id="admin-portal-card">
            <div className="portal-icon">⚙️</div>
            <h2 className="portal-title">Admin Portal</h2>
            <p className="portal-desc">Admin can update laundry status for students.</p>
            <button className="portal-btn admin-btn">
              Admin Login
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
