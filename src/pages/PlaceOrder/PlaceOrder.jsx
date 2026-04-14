import React, { useContext, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DELIVERY_FEE = 2;

const PlaceOrder = () => {
  const { cartItems, food_list, getTotalCartAmount, token, API_URL } = useContext(StoreContext);
  const navigate = useNavigate();
  const subtotal = getTotalCartAmount();
  const total = subtotal + (subtotal > 0 ? DELIVERY_FEE : 0);

  const [address, setAddress] = useState({
    firstName: '', lastName: '', email: '',
    street: '', city: '', state: '',
    zipCode: '', country: '', phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Please login to place an order.');
      return;
    }
    setLoading(true);
    setError('');

    const items = food_list
      .filter((item) => cartItems[item._id] && cartItems[item._id] > 0)
      .map((item) => ({
        foodId: item._id,
        name: item.name,
        price: item.price,
        quantity: cartItems[item._id],
        image: item.image,
      }));

    try {
      const { data } = await axios.post(
        `${API_URL}/order/place`,
        { items, address, amount: subtotal },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        navigate('/myorders');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className='place-order' onSubmit={handlePlaceOrder}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input name="firstName" onChange={handleChange} value={address.firstName} type="text" placeholder='First name' required />
          <input name="lastName" onChange={handleChange} value={address.lastName} type="text" placeholder='Last name' required />
        </div>
        <input name="email" onChange={handleChange} value={address.email} type="email" placeholder='Email address' required />
        <input name="street" onChange={handleChange} value={address.street} type="text" placeholder='Street' required />
        <div className="multi-fields">
          <input name="city" onChange={handleChange} value={address.city} type="text" placeholder='City' required />
          <input name="state" onChange={handleChange} value={address.state} type="text" placeholder='State' required />
        </div>
        <div className="multi-fields">
          <input name="zipCode" onChange={handleChange} value={address.zipCode} type="text" placeholder='Zip code' required />
          <input name="country" onChange={handleChange} value={address.country} type="text" placeholder='Country' required />
        </div>
        <input name="phone" onChange={handleChange} value={address.phone} type="tel" placeholder='Phone' required />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Order Summary</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${subtotal.toFixed(2)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${DELIVERY_FEE.toFixed(2)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p><strong>Total</strong></p>
              <p><strong>${total.toFixed(2)}</strong></p>
            </div>
          </div>
          {error && <p className="order-error">{error}</p>}
          <button type="submit" disabled={loading || subtotal === 0}>
            {loading ? 'Placing Order...' : 'PLACE ORDER'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
