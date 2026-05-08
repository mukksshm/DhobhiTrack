import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const STATUSES = [
  { key: 'received', label: 'Received', icon: '🔄', color: 'received' },
  { key: 'washing', label: 'Washing', icon: '🧼', color: 'washing' },
  { key: 'ready', label: 'Ready for Pickup', icon: '✅', color: 'ready' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(new Set());
  const [bulkUpdating, setBulkUpdating] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('dhobitrack_admin_session')) { navigate('/admin/login'); return; }
    loadOrders();
  }, [navigate]);

  const loadOrders = () => {
    const all = JSON.parse(localStorage.getItem('dhobitrack_orders') || '[]');
    setOrders([...all].reverse());
  };

  const updateOrders = (ids, newStatus) => {
    setBulkUpdating(true);
    setTimeout(() => {
      const all = JSON.parse(localStorage.getItem('dhobitrack_orders') || '[]');
      const updated = all.map(o =>
        ids.includes(o.id) ? { ...o, status: newStatus, updatedAt: new Date().toISOString() } : o
      );
      localStorage.setItem('dhobitrack_orders', JSON.stringify(updated));
      setOrders([...updated].reverse());
      setSelected(new Set());
      setBulkUpdating(false);
    }, 500);
  };

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map(o => o.id)));
    }
  };

  const logout = () => {
    localStorage.removeItem('dhobitrack_admin_session');
    navigate('/');
  };

  const filtered = orders.filter(o => {
    const matchFilter = filter === 'all' || o.status === filter || (filter === 'pending' && !o.status);
    const q = search.toLowerCase();
    const matchSearch = !q ||
      o.laundryId?.toLowerCase().includes(q) ||
      o.studentName?.toLowerCase().includes(q) ||
      o.mobile?.includes(q);
    return matchFilter && matchSearch;
  });

  const counts = {
    all: orders.length,
    pending: orders.filter(o => !o.status).length,
    received: orders.filter(o => o.status === 'received').length,
    washing: orders.filter(o => o.status === 'washing').length,
    ready: orders.filter(o => o.status === 'ready').length,
  };

  const selectedIds = Array.from(selected);
  const allSelected = filtered.length > 0 && selected.size === filtered.length;

  return (
    <div className="dashboard-page">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <nav className="dash-nav">
        <div className="nav-logo">
          <span className="logo-icon">🧺</span>
          <span className="logo-text">DhobhiTrack</span>
          <span className="admin-badge-nav">Admin</span>
        </div>
        <button className="btn-logout" onClick={logout}>Logout</button>
      </nav>

      <div className="dashboard-content animate-slide-up">
        <div className="admin-header">
          <h1 className="admin-title">Laundry Management</h1>
          <p className="admin-subtitle">Select multiple orders to update their status at once</p>
        </div>

        {/* Stats */}
        <div className="stats-row">
          {[
            { label: 'Total', value: counts.all, icon: '📦' },
            { label: 'Pending', value: counts.pending, icon: '⏳' },
            { label: 'Washing', value: counts.washing, icon: '🧼' },
            { label: 'Ready', value: counts.ready, icon: '✅' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <span className="stat-card-icon">{s.icon}</span>
              <span className="stat-card-value">{s.value}</span>
              <span className="stat-card-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Search + Filters */}
        <div className="admin-controls">
          <input
            id="admin-search"
            className="form-input search-input"
            type="text"
            placeholder="🔍 Search by Laundry ID, name, or mobile..."
            value={search}
            onChange={e => { setSearch(e.target.value); setSelected(new Set()); }}
          />
          <div className="filter-tabs">
            {[
              { key: 'all', label: 'All', icon: '📋' },
              { key: 'pending', label: 'Pending', icon: '⏳' },
              ...STATUSES.map(s => ({ key: s.key, label: s.label, icon: s.icon })),
            ].map(({ key, label, icon }) => (
              <button key={key} id={`filter-${key}`}
                className={`filter-tab ${filter === key ? 'active' : ''}`}
                onClick={() => { setFilter(key); setSelected(new Set()); }}>
                {icon} {label}
                <span className="tab-badge">{counts[key] ?? 0}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bulk Action Bar */}
        {selected.size > 0 && (
          <div className="bulk-bar animate-slide-down">
            <span className="bulk-count">{selected.size} order{selected.size > 1 ? 's' : ''} selected</span>
            <div className="bulk-actions">
              {STATUSES.map(s => (
                <button key={s.key} id={`bulk-${s.key}`}
                  className={`bulk-btn bulk-${s.color}`}
                  onClick={() => updateOrders(selectedIds, s.key)}
                  disabled={bulkUpdating}>
                  {bulkUpdating ? <span className="btn-spinner dark"></span> : s.icon}
                  {' '}Mark as {s.label}
                </button>
              ))}
            </div>
            <button className="bulk-clear" onClick={() => setSelected(new Set())}>✕ Clear</button>
          </div>
        )}

        {/* Orders List */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No orders found</h3>
            <p>{search ? 'Try a different search term.' : 'No laundry records yet.'}</p>
          </div>
        ) : (
          <div className="admin-orders-list">
            {/* Select All Header */}
            <div className="select-all-row">
              <label className="checkbox-label">
                <input
                  id="select-all-checkbox"
                  type="checkbox"
                  className="custom-checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                />
                <span className="checkbox-custom"></span>
                <span className="select-all-text">
                  {allSelected ? 'Deselect All' : `Select All (${filtered.length})`}
                </span>
              </label>
            </div>

            {filtered.map(order => {
              const st = STATUSES.find(s => s.key === order.status);
              const isChecked = selected.has(order.id);
              return (
                <div
                  key={order.id}
                  className={`admin-order-card ${isChecked ? 'selected' : ''}`}
                  onClick={() => toggleSelect(order.id)}
                >
                  <label className="checkbox-label" onClick={e => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="custom-checkbox"
                      checked={isChecked}
                      onChange={() => toggleSelect(order.id)}
                    />
                    <span className="checkbox-custom"></span>
                  </label>

                  <div className="admin-order-info">
                    <div className="order-bag">{order.laundryId}</div>
                    <div className="admin-student-info">
                      <span className="student-name">{order.studentName}</span>
                      <span className="student-room">{order.mobile}</span>
                    </div>
                  </div>

                  <div className="admin-order-meta">
                    <span className="order-date">
                      Registered: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    {order.updatedAt && order.status && (
                      <span className="order-date">
                        Updated: {new Date(order.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    )}
                  </div>

                  <div className="admin-order-right" onClick={e => e.stopPropagation()}>
                    {!order.status ? (
                      <span className="status-badge status-pending">⏳ Pending</span>
                    ) : (
                      <span className={`status-badge status-${st?.color}`}>{st?.icon} {st?.label}</span>
                    )}
                    <select
                      id={`status-select-${order.id}`}
                      className="status-select"
                      value={order.status || ''}
                      onChange={e => updateOrders([order.id], e.target.value)}
                    >
                      <option value="" disabled>Set status...</option>
                      {STATUSES.map(s => (
                        <option key={s.key} value={s.key}>{s.icon} {s.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
