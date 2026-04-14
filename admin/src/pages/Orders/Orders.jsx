import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { toast } from 'react-toastify';
import './Orders.css';

const STATUSES = ['Pending', 'Processing', 'Out for Delivery', 'Delivered'];

const statusColor = {
  'Pending': '#fdcb6e',
  'Processing': '#74b9ff',
  'Out for Delivery': '#a29bfe',
  'Delivered': '#55efc4',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    api.getOrders()
      .then(({ data }) => { if (data.success) setOrders(data.data); })
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  const handleStatus = async (id, status) => {
    try {
      await api.updateOrderStatus(id, status);
      setOrders(p => p.map(o => o._id === id ? { ...o, status } : o));
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1 className="page-title">Orders</h1>
        <span className="order-count">{filtered.length} orders</span>
      </div>

      <div className="order-filters">
        {['All', ...STATUSES].map(s => (
          <button key={s} className={`cat-tab ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>{s}</button>
        ))}
      </div>

      {loading ? <p className="page-loading">Loading...</p> : (
        <div className="orders-list">
          {filtered.length === 0 && <p className="page-loading">No orders found.</p>}
          {filtered.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-card-header">
                <div>
                  <p className="order-id">#{order._id.slice(-8).toUpperCase()}</p>
                  <p className="order-date">{new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div className="order-header-right">
                  <span className="order-amount">${order.amount.toFixed(2)}</span>
                  <select
                    className="status-select"
                    value={order.status}
                    onChange={e => handleStatus(order._id, e.target.value)}
                    style={{ borderColor: statusColor[order.status] }}
                  >
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="order-customer">
                <span>👤 {order.userId?.name || 'Unknown'}</span>
                <span>✉️ {order.userId?.email || '—'}</span>
                {order.address?.phone && <span>📞 {order.address.phone}</span>}
              </div>

              <div className="order-address">
                📍 {[order.address?.street, order.address?.city, order.address?.state, order.address?.country].filter(Boolean).join(', ')}
              </div>

              <div className="order-items">
                {order.items.map((item, i) => (
                  <span key={i} className="order-item-tag">{item.name} ×{item.quantity}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
