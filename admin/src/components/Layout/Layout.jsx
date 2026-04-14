import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Topbar from '../Topbar/Topbar';
import './Layout.css';

const Layout = ({ setToken }) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className={`layout ${collapsed ? 'collapsed' : ''}`}>
      <Sidebar collapsed={collapsed} />
      <div className="layout-main">
        <Topbar setToken={setToken} onToggle={() => setCollapsed(p => !p)} />
        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
