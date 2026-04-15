import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { StoreContext } from '../../context/StoreContext';
import { FaTrash, FaEdit, FaCloudUploadAlt } from 'react-icons/fa';

const ListProducts = () => {
  const { API_URL } = useContext(StoreContext);
  const [list, setList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editImage, setEditImage] = useState(false);
  const [editData, setEditData] = useState({ name: '', description: '', price: '', category: '' });

  const fetchList = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    try {
      const response = await axios.get(`${API_URL}/admin/foods`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setList(response.data.data);
      }
    } catch (error) {
      toast.error('Error fetching foods');
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const removeFood = async (foodId) => {
    const token = localStorage.getItem('adminToken');
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const response = await axios.delete(`${API_URL}/admin/foods/${foodId}`, {
         headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        toast.success(response.data.message || 'Food removed');
        await fetchList();
      } else {
        toast.error('Error removing food');
      }
    } catch (error) {
      toast.error('Error removing food');
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setEditData({ name: item.name, description: item.description, price: item.price, category: item.category });
    setEditImage(false);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const saveEdit = async () => {
    const token = localStorage.getItem('adminToken');
    
    const formData = new FormData();
    formData.append("name", editData.name);
    formData.append("description", editData.description);
    formData.append("price", Number(editData.price));
    formData.append("category", editData.category);
    if(editImage) formData.append("image", editImage);

    try {
      const response = await axios.put(`${API_URL}/admin/foods/${editingId}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setEditingId(null);
        toast.success("Food updated successfully!");
        await fetchList();
      } else {
        toast.error("Error updating food");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating food");
    }
  };

  return (
    <div className="admin-list-container">
      <h2>All Foods List</h2>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => {
              if (editingId === item._id) {
                // Inline Edit Mode
                return (
                  <tr key={item._id}>
                    <td>
                        <label htmlFor="editImg" style={{cursor: 'pointer'}}>
                           <img src={editImage ? URL.createObjectURL(editImage) : `http://localhost:4000/images/${item.image}`} alt="" title="Change Image"/>
                        </label>
                        <input type="file" id="editImg" hidden onChange={(e)=>setEditImage(e.target.files[0])}/>
                    </td>
                    <td><input type="text" name="name" value={editData.name} onChange={handleEditChange} style={{width:'100%', background:'#0f172a', border:'1px solid #334155', color:'#fff', padding:'5px'}}/></td>
                    <td>
                      <select name="category" value={editData.category} onChange={handleEditChange} style={{width:'100%', background:'#0f172a', border:'1px solid #334155', color:'#fff', padding:'5px'}}>
                         <option value="Salad">Salad</option>
                         <option value="Rolls">Rolls</option>
                         <option value="Deserts">Deserts</option>
                         <option value="Sandwich">Sandwich</option>
                         <option value="Cake">Cake</option>
                         <option value="Pure Veg">Pure Veg</option>
                         <option value="Pasta">Pasta</option>
                         <option value="Noodles">Noodles</option>
                      </select>
                    </td>
                    <td><input type="text" name="price" value={editData.price} onChange={handleEditChange} style={{width:'60px', background:'#0f172a', border:'1px solid #334155', color:'#fff', padding:'5px'}}/></td>
                    <td>
                      <button className="admin-btn" style={{padding:'5px 10px', fontSize:'12px', marginRight:'5px'}} onClick={saveEdit}>Save</button>
                      <button className="action-btn delete" onClick={() => setEditingId(null)}>Cancel</button>
                    </td>
                  </tr>
                )
              }
              // Normal Mode
              return (
                <tr key={item._id}>
                  <td><img src={`http://localhost:4000/images/${item.image}`} alt="" /></td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>${item.price}</td>
                  <td>
                    <button className="action-btn edit" onClick={() => startEdit(item)}><FaEdit /></button>
                    <button className="action-btn delete" onClick={() => removeFood(item._id)}><FaTrash /></button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListProducts;
