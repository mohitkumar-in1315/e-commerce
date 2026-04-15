import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { StoreContext } from '../../context/StoreContext';
import { FaCloudUploadAlt } from 'react-icons/fa';

const AddProduct = () => {
  const { API_URL } = useContext(StoreContext);
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Salad'
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error('Please upload an image first.');
      return;
    }
    const token = localStorage.getItem('adminToken');
    if (!token) {
      toast.error('Admin token not found. Please wait to auto-login or refresh.');
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("image", image);

    try {
      const response = await axios.post(`${API_URL}/admin/foods`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setData({ name: '', description: '', price: '', category: 'Salad' });
        setImage(false);
        toast.success(response.data.message || "Food Added Successfully!");
      } else {
        toast.error(response.data.message || "Error adding food");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding food");
    }
  };

  return (
    <div className="admin-form-container">
      <h2>Add New Product</h2>
      <form onSubmit={onSubmitHandler}>
        <div className="admin-field">
          <label>Upload Image</label>
          <label htmlFor="image" className="image-upload-box">
            {image ? (
              <img src={URL.createObjectURL(image)} alt="" />
            ) : (
              <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                <FaCloudUploadAlt size={40} color="#ff6b6b" />
                <div style={{ marginTop: 8, fontSize: '13px' }}>Click to Upload</div>
              </div>
            )}
          </label>
          <input 
            type="file" 
            id="image" 
            hidden 
            onChange={(e) => setImage(e.target.files[0])} 
          />
        </div>

        <div className="admin-field">
          <label>Product Name</label>
          <input type="text" name="name" value={data.name} onChange={onChangeHandler} placeholder="Type here" required />
        </div>

        <div className="admin-field">
          <label>Product Description</label>
          <textarea name="description" value={data.description} onChange={onChangeHandler} rows="4" placeholder="Write content here" required />
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          <div className="admin-field" style={{ flex: 1 }}>
            <label>Product Category</label>
            <select name="category" value={data.category} onChange={onChangeHandler}>
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>

          <div className="admin-field" style={{ flex: 1 }}>
            <label>Product Price</label>
            <input type="number" name="price" value={data.price} onChange={onChangeHandler} placeholder="$20" required />
          </div>
        </div>

        <button type="submit" className="admin-btn">ADD PRODUCT</button>
      </form>
    </div>
  );
};

export default AddProduct;
