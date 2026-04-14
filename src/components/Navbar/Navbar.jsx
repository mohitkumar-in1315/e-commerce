import React, { useContext, useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const { cartItems, user, logout } = useContext(StoreContext);
  const navigate = useNavigate();

  const cartCount = Object.values(cartItems).reduce((a, b) => a + b, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className='navbar'>
      <Link to='/'><img src={assets.logo} alt="Tomato" className='logo' /></Link>

      <ul className='navbar-menu'>
        <Link to="/" onClick={() => setMenu('home')} className={menu === 'home' ? "active" : ""}>Home</Link>
        <a href="#explore-menu" onClick={() => setMenu('menu')} className={menu === 'menu' ? "active" : ""}>Menu</a>
        <a href="#app-download" onClick={() => setMenu('about')} className={menu === 'about' ? "active" : ""}>About</a>
        <a href="#footer" onClick={() => setMenu('contact')} className={menu === 'contact' ? "active" : ""}>Contact</a>
      </ul>

      <div className='navbar-right'>
        <img src={assets.search_icon} alt="Search" className='cart-icon' />
        <div className='navbar-search-icon'>
          <Link to='/cart'>
            <img src={assets.basket_icon} alt="Cart" className='cart-icon' />
          </Link>
          {cartCount > 0 && <div className='dot'>{cartCount}</div>}
        </div>

        {user ? (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="Profile" className='cart-icon' />
            <ul className="navbar-profile-dropdown">
              <li onClick={() => navigate('/myorders')}>
                <img src={assets.bag_icon} alt="" /> Orders
              </li>
              <hr />
              <li onClick={handleLogout}>
                <img src={assets.logout_icon} alt="" /> Logout
              </li>
            </ul>
          </div>
        ) : (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
