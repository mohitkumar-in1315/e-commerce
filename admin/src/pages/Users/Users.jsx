import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { toast } from 'react-toastify';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getUsers()
      .then(({ data }) => { if (data.success) setUsers(data.data); })
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await api.deleteUser(id);
      toast.success('User deleted');
      setUsers(p => p.filter(u => u._id !== id));
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="users-page">
      <div className="page-header">
        <h1 className="page-title">Users</h1>
        <span className="order-count">{users.length} total</span>
      </div>

      <input
        className="search-input"
        placeholder="🔍 Search by name or email..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 20 }}
      />

      {loading ? <p className="page-loading">Loading...</p> : (
        <div className="users-table-wrap">
          <table className="users-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Cart Items</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="empty-row">No users found</td></tr>
              )}
              {filtered.map((user, i) => (
                <tr key={user._id}>
                  <td className="user-num">{i + 1}</td>
                  <td>
                    <div className="user-avatar">{user.name[0].toUpperCase()}</div>
                    <span className="user-name">{user.name}</span>
                  </td>
                  <td className="user-email">{user.email}</td>
                  <td className="user-date">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>{Object.keys(user.cartData || {}).length} items</td>
                  <td>
                    <button className="btn-delete" onClick={() => handleDelete(user._id, user.name)}>
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users;
