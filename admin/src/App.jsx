import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login/Login';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import FoodList from './pages/FoodList/FoodList';
import AddFood from './pages/AddFood/AddFood';
import Orders from './pages/Orders/Orders';
import Users from './pages/Users/Users';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');

  useEffect(() => {
    if (token) localStorage.setItem('adminToken', token);
    else localStorage.removeItem('adminToken');
  }, [token]);

  if (!token) return (
    <>
      <Login setToken={setToken} />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout setToken={setToken} />}>
          <Route index element={<Dashboard />} />
          <Route path="foods" element={<FoodList />} />
          <Route path="foods/add" element={<AddFood />} />
          <Route path="foods/edit/:id" element={<AddFood />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default App;
