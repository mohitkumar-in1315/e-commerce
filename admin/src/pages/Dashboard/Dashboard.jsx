import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { toast } from 'react-toastify';
import './Dashboard.css';

const StatCard = ({ icon, label, value, color }) => (
  <div className="stat-card" style={{ borderTop: `4px solid ${color}` }}>
    <div className="stat-icon" style={{ background: color + '20', color }}>{icon}</div>
    <div>
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getStats()
      .then(({ data }) => { if (data.success) setStats(data.data); })
      .catch(() => toast.error('Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading">Loading dashboard...</div>;

  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard</h1>
      <div className="stats-grid">
        <StatCard icon="📦" label="Total Orders"   value={stats.totalOrders}          color="#6c5ce7" />
        <StatCard icon="💰" label="Total Revenue"  value={`$${stats.totalRevenue.toFixed(2)}`} color="#00b894" />
        <StatCard icon="👥" label="Total Users"    value={stats.totalUsers}            color="#0984e3" />
        <StatCard icon="🍔" label="Food Items"     value={stats.totalFoods}            color="tomato"  />
        <StatCard icon="⏳" label="Pending Orders" value={stats.pending}               color="#fdcb6e" />
        <StatCard icon="✅" label="Delivered"      value={stats.delivered}             color="#55efc4" />
      </div>
    </div>
  );
};

export default Dashboard;
