import React, { useState, useEffect } from 'react';
import * as itemApi from '../api/itemApi';
import './ItemManager.css';

const ItemManager = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Form state
    const [formData, setFormData] = useState({ name: '', description: '', price: '' });
    const [editingId, setEditingId] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formError, setFormError] = useState('');

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        try {
            setLoading(true);
            const data = await itemApi.getItems();
            setItems(data);
            setError('');
        } catch (err) {
            setError('Failed to load items. Please make sure the backend is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        // Basic frontend validation
        if (!formData.name || !formData.price) {
            setFormError('Name and Price are required fields.');
            return;
        }

        try {
            if (editingId) {
                await itemApi.updateItem(editingId, formData);
            } else {
                await itemApi.createItem(formData);
            }
            
            // Reset form and reload list
            resetForm();
            loadItems();
        } catch (err) {
            const apiErr = err.response?.data?.error || 'An error occurred while saving the item.';
            setFormError(apiErr);
            console.error(err);
        }
    };

    const handleEdit = (item) => {
        setFormData({ name: item.name, description: item.description || '', price: item.price });
        setEditingId(item.id);
        setIsFormOpen(true);
        setFormError('');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        
        try {
            await itemApi.deleteItem(id);
            loadItems();
        } catch (err) {
            alert('Failed to delete item.');
            console.error(err);
        }
    };

    const resetForm = () => {
        setFormData({ name: '', description: '', price: '' });
        setEditingId(null);
        setIsFormOpen(false);
        setFormError('');
    };

    return (
        <div className="item-manager-container">
            <div className="item-manager-header">
                <h2>Item Inventory</h2>
                <button className="btn-primary" onClick={() => setIsFormOpen(true)}>
                    + Add New Item
                </button>
            </div>

            {error && <div className="error-alert">{error}</div>}

            {loading ? (
                <div className="loading-state">Loading items...</div>
            ) : items.length === 0 ? (
                <div className="empty-state">
                    <h3>No items found</h3>
                    <p>Get started by adding your first item to the inventory.</p>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="item-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Price ($)</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(item => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td><strong>{item.name}</strong></td>
                                    <td>{item.description || <span className="text-muted">N/A</span>}</td>
                                    <td>{Number(item.price).toFixed(2)}</td>
                                    <td className="actions-cell">
                                        <button className="btn-icon edit" onClick={() => handleEdit(item)}>
                                            Edit
                                        </button>
                                        <button className="btn-icon delete" onClick={() => handleDelete(item.id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Inline Modal Form */}
            {isFormOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{editingId ? 'Edit Item' : 'Add New Item'}</h3>
                        
                        {formError && <div className="form-error">{formError}</div>}
                        
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Name *</label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleInputChange} 
                                    placeholder="Enter item name"
                                    required 
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="price">Price ($) *</label>
                                <input 
                                    type="number" 
                                    id="price" 
                                    name="price" 
                                    value={formData.price} 
                                    onChange={handleInputChange} 
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    required 
                                />
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea 
                                    id="description" 
                                    name="description" 
                                    value={formData.description} 
                                    onChange={handleInputChange} 
                                    placeholder="Enter item description (optional)"
                                    rows="3"
                                />
                            </div>
                            
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={resetForm}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    {editingId ? 'Save Changes' : 'Create Item'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemManager;
