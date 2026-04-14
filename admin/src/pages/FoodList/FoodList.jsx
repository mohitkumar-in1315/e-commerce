import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, getImageUrl } from '../../utils/api';
import { toast } from 'react-toastify';
import './FoodList.css';

const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const navigate = useNavigate();

  const fetchFoods = () => {
    api.getFoods()
      .then(({ data }) => { if (data.success) setFoods(data.data); })
      .catch(() => toast.error('Failed to load foods'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchFoods(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await api.deleteFood(id);
      toast.success('Food deleted');
      setFoods(p => p.filter(f => f._id !== id));
    } catch {
      toast.error('Failed to delete');
    }
  };

  const categories = ['All', ...new Set(foods.map(f => f.category))];
  const filtered = foods.filter(f =>
    (category === 'All' || f.category === category) &&
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="food-list">
      <div className="page-header">
        <h1 className="page-title">Food Items</h1>
        <button className="btn-primary" onClick={() => navigate('/foods/add')}>+ Add Food</button>
      </div>

      <div className="list-filters">
        <input
          className="search-input"
          placeholder="🔍 Search food..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="category-tabs">
          {categories.map(c => (
            <button
              key={c}
              className={`cat-tab ${category === c ? 'active' : ''}`}
              onClick={() => setCategory(c)}
            >{c}</button>
          ))}
        </div>
      </div>

      {loading ? <p className="page-loading">Loading...</p> : (
        <div className="food-table-wrap">
          <table className="food-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="empty-row">No food items found</td></tr>
              )}
              {filtered.map(food => (
                <tr key={food._id}>
                  <td>
                    <img className="food-thumb" src={getImageUrl(food.image)} alt={food.name} />
                  </td>
                  <td>
                    <p className="food-name">{food.name}</p>
                    <p className="food-desc">{food.description}</p>
                  </td>
                  <td><span className="badge">{food.category}</span></td>
                  <td className="food-price">${food.price}</td>
                  <td>
                    <div className="action-btns">
                      <button className="btn-edit" onClick={() => navigate(`/foods/edit/${food._id}`)}>✏️ Edit</button>
                      <button className="btn-delete" onClick={() => handleDelete(food._id, food.name)}>🗑️ Delete</button>
                    </div>
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

export default FoodList;
