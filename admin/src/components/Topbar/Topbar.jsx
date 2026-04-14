import React from 'react';
import './Topbar.css';

const Topbar = ({ setToken, onToggle }) => (
  <header className="topbar">
    <button className="topbar-toggle" onClick={onToggle}>☰</button>
    <div className="topbar-right">
      <span className="topbar-admin">👤 Admin</span>
      <button className="topbar-logout" onClick={() => setToken('')}>Logout</button>
    </div>
  </header>
);

export default Topbar;
