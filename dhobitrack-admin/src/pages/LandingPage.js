import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <nav className="landing-nav animate-slide-down">
        <div className="nav-logo">
          <span className="logo-icon">🧺</span>
          <span className="logo-text">DhobhiTrack</span>
        </div>
      </nav>

      <main className="landing-hero">
        <div className="hero-badge animate-slide-up">
          <span className="badge-dot"></span>
          Smart Laundry Tracking
        </div>
        <h1 className="hero-title animate-slide-up-delay-1">
          Track Your Laundry<br />
          <span className="hero-gradient">In Real-Time</span>
        </h1>
        <p className="hero-subtitle animate-slide-up-delay-2">
          No more guessing. Know exactly when your clothes are received, being washed, or ready for pickup.
        </p>

        <div className="portal-cards animate-slide-up-delay-3">
          <div className="portal-card" onClick={() => navigate('/student/login')} id="student-portal-card">
            <div className="portal-icon">🎓</div>
            <h2 className="portal-title">Student Portal</h2>
            <p className="portal-desc">Submit laundry, track bag status, and get notified when it's ready.</p>
            <button className="portal-btn student-btn">
              Enter as Student
              <span className="btn-arrow">→</span>
            </button>
          </div>

          <div className="portal-card admin-card" onClick={() => navigate('/admin/login')} id="admin-portal-card">
            <div className="portal-icon">⚙️</div>
            <h2 className="portal-title">Admin Portal</h2>
            <p className="portal-desc">Manage orders, update status, and oversee all laundry operations.</p>
            <button className="portal-btn admin-btn">
              Enter as Admin
              <span className="btn-arrow">→</span>
            </button>
          </div>
        </div>

        <div className="hero-stats animate-slide-up-delay-3">
          <div className="stat-item">
            <span className="stat-number">5</span>
            <span className="stat-label">Status Stages</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Live Tracking</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number">0</span>
            <span className="stat-label">Confusion</span>
          </div>
        </div>
      </main>
    </div>
  );
}
