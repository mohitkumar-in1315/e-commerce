import React, { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import MyOrders from './pages/MyOrders/MyOrders';
import Footer from './components/Footer/Footer';
import LoginPopup from './components/LoginPopup/LoginPopup';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AdminLayout from './pages/Admin/AdminLayout';
import AddProduct from './pages/Admin/AddProduct';
import ListProducts from './pages/Admin/ListProducts';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <ToastContainer autoClose={2000} position="top-right" theme="dark" />
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      
      <Routes>
        {/* Admin Section */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="add" element={<AddProduct />} />
          <Route path="list" element={<ListProducts />} />
        </Route>

        {/* Consumer application logic (catch-all for non-admin) */}
        <Route path="*" element={
          <>
            <div className="app">
              <Navbar setShowLogin={setShowLogin} />
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/cart' element={<Cart />} />
                <Route path='/placeorder' element={<PlaceOrder />} />
                <Route path='/myorders' element={<MyOrders />} />
              </Routes>
            </div>
            <Footer />
          </>
        } />
      </Routes>
    </>
  );
};

export default App;
