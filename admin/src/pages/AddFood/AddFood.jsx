import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, getImageUrl } from '../../utils/api';
import { toast } from 'react-toastify';
import './AddFood.css';

const CATEGORIES = ['Salad', 'Rolls', 'Deserts', 'Sandwich', 'Cake', 'Pure Veg', 'Pasta', 'Noodles'];

const AddFood = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({ name: '', description: '', price: '', category: 'Salad' });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      api.getFoods().then(({ data }) => {
        const food = data.data.find(f => f._id === id);
        if (food) {
          setForm({ name: food.name, description: food.description, price: food.price, category: food.category });
          setPreview(getImageUrl(food.image));
        }
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEdit && !imageFile) return toast.error('Please select an image');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);

      if (isEdit) await api.updateFood(id, fd);
      else await api.addFood(fd);

      toast.success(isEdit ? 'Food updated!' : 'Food added!');
      navigate('/foods');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save food');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-food">
      <h1 className="page-title">{isEdit ? 'Edit Food Item' : 'Add Food Item'}</h1>
      <form className="add-food-form" onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Food Image</label>
          <div className="image-upload" onClick={() => document.getElementById('imgInput').click()}>
            {preview
              ? <img src={preview} alt="preview" />
              : <div className="image-placeholder">📷 Click to upload</div>
            }
          </div>
          <input id="imgInput" type="file" accept="image/*" onChange={handleImage} hidden />
        </div>

        <div className="form-group">
          <label>Food Name</label>
          <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Greek Salad" required />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Short description..." required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <select name="category" value={form.category} onChange={handleChange}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Price ($)</label>
            <input name="price" type="number" min="1" value={form.price} onChange={handleChange} placeholder="12" required />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate('/foods')}>Cancel</button>
          <button type="submit" className="btn-save" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Food' : 'Add Food'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddFood;
