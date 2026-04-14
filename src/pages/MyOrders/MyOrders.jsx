import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';

const MyOrders = () => {
  const { token, API_URL } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/order/myorders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.success) setOrders(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchOrders();
    else setLoading(false);
  }, [token, API_URL]);

  if (loading) return <p className="orders-loading">Loading orders...</p>;
  if (!token) return <p className="orders-loading">Please login to view your orders.</p>;

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className="container">
        {orders.length === 0 && <p>No orders yet.</p>}
        {orders.map((order) => (
          <div key={order._id} className="my-orders-order">
            <img src={assets.parcel_icon} alt="Order" />
            <p>{order.items.map((i) => `${i.name} x${i.quantity}`).join(', ')}</p>
            <p>${order.amount.toFixed(2)}</p>
            <p>Items: {order.items.length}</p>
            <p><span>&#x25cf;</span> <b>{order.status}</b></p>
            <button>Track Order</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
