import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const AdminDashboard = () => {
    const { logout, user } = useAuth();
    const [activeTab, setActiveTab] = useState('food');
    const [foodItems, setFoodItems] = useState([]);
    const [newItem, setNewItem] = useState({ name: '', category: 'Breakfast', dietType: 'Veg', image: '' });
    const [menuData, setMenuData] = useState(null);

    useEffect(() => {
        fetchFoodItems();
    }, []);

    const fetchFoodItems = async () => {
        try {
            const res = await api.get('/admin/food-items');
            setFoodItems(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/food-item', newItem);
            setNewItem({ name: '', category: 'Breakfast', dietType: 'Veg', image: '' });
            fetchFoodItems();
            alert('Item added!');
        } catch (err) {
            alert('Error adding item');
        }
    };

    const handleGenerateMonthly = async () => {
        try {
            const month = new Date().toISOString().slice(0, 7); // YYYY-MM
            const res = await api.get(`/admin/generate-monthly?month=${month}`);
            setMenuData(res.data);
        } catch (err) {
            alert('Error generating menu');
        }
    };

    const handleLockMenu = async () => {
        if (!menuData || !menuData.suggestedItems) return;
        try {
            const month = new Date().toISOString().slice(0, 7);
            const itemIds = menuData.suggestedItems.map(i => i._id);
            await api.post('/admin/menu', { month, items: itemIds });
            alert('Menu Locked Successfully!');
        } catch (err) {
            alert('Error locking menu');
        }
    };

    return (
        <div className="page-transition">
            <header className="dashboard-header">
                <div className="dashboard-brand">
                    <h1>Admin Console</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Welcome, {user.name}</p>
                </div>
                <button onClick={logout} className="btn btn-secondary">
                    Logout
                </button>
            </header>

            <div className="container">
                <nav className="nav-tabs">
                    <button className={`nav-btn ${activeTab === 'food' ? 'active' : ''}`} onClick={() => setActiveTab('food')}>Manage Food</button>
                    <button className={`nav-btn ${activeTab === 'menu' ? 'active' : ''}`} onClick={() => setActiveTab('menu')}>Menu Generation</button>
                </nav>

                {activeTab === 'food' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="glass-panel" style={{ padding: '2rem' }}>
                            <h3 style={{ marginBottom: '1.5rem' }}>Add New Item</h3>
                            <form onSubmit={handleAddItem} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
                                <div className="form-group" style={{ margin: 0 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Name</label>
                                    <input
                                        type="text"
                                        placeholder="E.g. Masala Dosa"
                                        className="form-input"
                                        value={newItem.name}
                                        onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group" style={{ margin: 0 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Category</label>
                                    <select
                                        className="form-input"
                                        value={newItem.category}
                                        onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                                    >
                                        <option>Breakfast</option>
                                        <option>Lunch</option>
                                        <option>Snack</option>
                                        <option>Dinner</option>
                                    </select>
                                </div>
                                <div className="form-group" style={{ margin: 0 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Diet Type</label>
                                    <select
                                        className="form-input"
                                        value={newItem.dietType}
                                        onChange={e => setNewItem({ ...newItem, dietType: e.target.value })}
                                    >
                                        <option>Veg</option>
                                        <option>Non-Veg</option>
                                    </select>
                                </div>
                                <div className="form-group" style={{ margin: 0 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Image URL</label>
                                    <input
                                        type="text"
                                        placeholder="https://..."
                                        className="form-input"
                                        value={newItem.image || ''}
                                        onChange={e => setNewItem({ ...newItem, image: e.target.value })}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ height: '48px' }}>+ Add Item</button>
                            </form>
                        </div>

                        <div>
                            <h3 style={{ marginBottom: '1.5rem', paddingLeft: '0.5rem' }}>All Food Items ({foodItems.length})</h3>
                            <div className="food-grid">
                                {foodItems.map(item => (
                                    <div key={item._id} className="food-card">
                                        <div
                                            style={{
                                                height: '180px',
                                                width: '100%',
                                                backgroundImage: item.image ? `url(${item.image})` : 'none',
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                backgroundColor: item.image ? 'transparent' : 'rgba(255,255,255,0.05)',
                                                position: 'relative'
                                            }}
                                        >
                                            <span className={`diet-badge ${item.dietType === 'Non-Veg' ? 'diet-non-veg' : 'diet-veg'}`}>
                                                {item.dietType || 'Veg'}
                                            </span>

                                            {item.image && (
                                                <div style={{
                                                    position: 'absolute',
                                                    bottom: 0, left: 0, right: 0,
                                                    background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                                                    padding: '1rem', paddingTop: '3rem'
                                                }}>
                                                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'white' }}>{item.name}</h3>
                                                </div>
                                            )}
                                        </div>

                                        {!item.image && (
                                            <div className="food-card-content">
                                                <h3>{item.name}</h3>
                                                <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{item.category}</p>
                                            </div>
                                        )}

                                        {/* Fallback for category if image exists (overlay handles name) */}
                                        {item.image && (
                                            <div style={{ padding: '0.75rem', borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)' }}>
                                                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.category}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'menu' && (
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <div>
                                <h3>Monthly Menu Generation</h3>
                                <p style={{ color: 'var(--text-muted)' }}>Generate optimal menu based on student votes.</p>
                            </div>
                            <button onClick={handleGenerateMonthly} className="btn btn-primary">
                                Generate Suggestion
                            </button>
                        </div>

                        {menuData && (
                            <div className="animate-fade-in">
                                <h4 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Suggested Weekly Menu Plan</h4>
                                <div style={{ overflowX: 'auto' }}>
                                    <table className="glass-table">
                                        <thead>
                                            <tr>
                                                <th>Day</th>
                                                <th>Breakfast</th>
                                                <th>Lunch</th>
                                                <th>Snack</th>
                                                <th>Dinner</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {menuData.weekMenu && menuData.weekMenu.map((day, index) => (
                                                <tr key={index}>
                                                    <td style={{ fontWeight: 'bold' }}>{day.day}</td>
                                                    <td>{day.breakfast ? <span title={`${menuData.counts[day.breakfast._id]} votes`}>{day.breakfast.name}</span> : '-'}</td>
                                                    <td>{day.lunch ? <span title={`${menuData.counts[day.lunch._id]} votes`}>{day.lunch.name}</span> : '-'}</td>
                                                    <td>{day.snack ? <span title={`${menuData.counts[day.snack._id]} votes`}>{day.snack.name}</span> : '-'}</td>
                                                    <td>{day.dinner ? <span title={`${menuData.counts[day.dinner._id]} votes`}>{day.dinner.name}</span> : '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                                    <button onClick={handleLockMenu} className="btn btn-primary" style={{ background: 'var(--success)', borderColor: 'transparent' }}>
                                        Lock & Publish Menu
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
