import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const nav = [
  { to: '/',        icon: '📊', label: 'Dashboard' },
  { to: '/foods',   icon: '🍔', label: 'Food Items' },
  { to: '/orders',  icon: '📦', label: 'Orders'     },
  { to: '/users',   icon: '👥', label: 'Users'      },
];

const Sidebar = ({ collapsed }) => (
  <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
    <div className="sidebar-logo">
      <span className="sidebar-logo-icon">🍅</span>
      {!collapsed && <span className="sidebar-logo-text">Tomato Admin</span>}
    </div>
    <nav className="sidebar-nav">
      {nav.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          <span className="sidebar-icon">{icon}</span>
          {!collapsed && <span>{label}</span>}
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
