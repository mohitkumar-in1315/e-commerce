import React, { useEffect, useContext, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FaPlus, FaList, FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import './Admin.css';

const AdminLayout = () => {
  const { API_URL } = useContext(StoreContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loginAdmin = async () => {
      try {
        const response = await axios.post(`${API_URL}/admin/login`, {
          email: 'admin@tomato.com',
          password: 'admin123'
        });
        if (response.data.success) {
          localStorage.setItem('adminToken', response.data.token);
        }
      } catch (err) {
        console.error('Auto login failed', err);
      } finally {
        setLoading(false);
      }
    };
    loginAdmin();
  }, [API_URL]);

  if (loading) return <div style={{color:'white', padding: 20}}>Loading Admin...</div>;

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">Tomato Admin</div>
        <ul className="admin-nav-links">
          <li>
            <NavLink to="/admin/add" className={({ isActive }) => (isActive ? 'active' : '')}>
              <FaPlus /> Add Product
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/list" className={({ isActive }) => (isActive ? 'active' : '')}>
              <FaList /> List Products
            </NavLink>
          </li>
        </ul>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="admin-topbar-profile">
            <span>Admin</span>
            <FaUserCircle size={32} color="#CBD5E1" />
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
