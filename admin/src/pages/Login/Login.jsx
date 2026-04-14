import React, { useState } from 'react';
import { api } from '../../utils/api';
import { toast } from 'react-toastify';
import './Login.css';

const Login = ({ setToken }) => {
  const [form, setForm] = useState({ email: 'admin@tomato.com', password: 'admin123' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.login(form);
      if (data.success) {
        setToken(data.token);
        toast.success('Welcome back, Admin!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="login-logo">🍅</div>
        <h2>Tomato Admin</h2>
        <p className="login-sub">Sign in to your admin panel</p>
        <input
          type="email" placeholder="Admin email"
          value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
          required
        />
        <input
          type="password" placeholder="Password"
          value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default Login;
