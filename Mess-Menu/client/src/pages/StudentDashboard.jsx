import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const StudentDashboard = () => {
    const { logout, user } = useAuth();
    const [activeTab, setActiveTab] = useState('vote'); // vote, menu, feedback
    const [foodItems, setFoodItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]); // IDs for monthly vote
    const [menu, setMenu] = useState(null);

    // For feedback/replacement
    const [dislikedItems, setDislikedItems] = useState([]);
    const [replacementItems, setReplacementItems] = useState([]);
    const [activeCategory, setActiveCategory] = useState('Breakfast'); // For voting tab
    const [feedbackCategory, setFeedbackCategory] = useState('Breakfast'); // For feedback tab

    useEffect(() => {
        fetchFoodItems();
        fetchMenu();
    }, []);

    const fetchFoodItems = async () => {
        try {
            const res = await api.get('/admin/food-items');
            setFoodItems(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMenu = async () => {
        try {
            const month = new Date().toISOString().slice(0, 7);
            const res = await api.get(`/student/menu?month=${month}`);
            setMenu(res.data);
        } catch (err) {
            console.log('No menu found yet');
        }
    };

    const toggleSelection = (id, list, setList, max) => {
        if (list.includes(id)) {
            setList(list.filter(i => i !== id));
        } else {
            if (list.length >= max) {
                alert(`You can select only ${max} items`);
                return;
            }
            setList([...list, id]);
        }
    };

    const toggleMonthlySelection = (id, category) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(i => i !== id));
        } else {
            const currentCategorySelection = selectedItems.filter(itemId => {
                const item = foodItems.find(f => f._id === itemId);
                return item && item.category === category;
            });

            if (currentCategorySelection.length >= 7) {
                alert(`You can only select 7 items for ${category}`);
                return;
            }
            setSelectedItems([...selectedItems, id]);
        }
    };

    const submitMonthlyVote = async () => {
        const categories = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];
        for (const cat of categories) {
            const count = selectedItems.filter(id => {
                const item = foodItems.find(f => f._id === id);
                return item && item.category === cat;
            }).length;

            if (count !== 7) {
                alert(`Please select exactly 7 items for ${cat} (Current: ${count})`);
                return;
            }
        }

        try {
            const month = new Date().toISOString().slice(0, 7);
            await api.post('/student/vote-monthly', { month, selectedItems });
            alert('Vote submitted!');
        } catch (err) {
            alert('Error submitting vote');
        }
    };

    const submitFeedback = async () => {
        if (dislikedItems.length === 0) return;
        try {
            const month = new Date().toISOString().slice(0, 7);
            await api.post('/student/feedback', { month, week: 1, dislikedItems });
            alert('Feedback submitted!');
        } catch (err) {
            alert('Error submitting feedback');
        }
    };

    const submitReplacement = async () => {
        if (replacementItems.length === 0) return;
        try {
            const month = new Date().toISOString().slice(0, 7);
            await api.post('/student/vote-replacement', { month, week: 1, replacementItems });
            alert('Replacement vote submitted!');
        } catch (err) {
            alert('Error submitting replacement vote');
        }
    };

    const renderFoodItem = (item, isSelected, onClick) => (
        <div
            key={item._id}
            className={`food-card ${isSelected ? 'selected' : ''}`}
            onClick={onClick}
            style={{ cursor: 'pointer' }}
        >
            <div
                style={{
                    height: '200px',
                    width: '100%',
                    backgroundImage: item.image ? `url(${item.image})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: item.image ? 'transparent' : 'rgba(255,255,255,0.05)',
                    position: 'relative'
                }}
            >


                {/* Overlay for Text if Has Image */}
                {item.image && (
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                        padding: '1rem',
                        paddingTop: '3rem'
                    }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'white' }}>{item.name}</h3>
                    </div>
                )}
            </div>

            {!item.image && (
                <div className="food-card-content">
                    <h3>{item.name}</h3>
                </div>
            )}
        </div>
    );

    return (
        <div className="page-transition">
            <header className="dashboard-header">
                <div className="dashboard-brand">
                    <h1>Student Portal</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Welcome, {user.name}</p>
                </div>
                <button onClick={logout} className="btn btn-secondary">
                    Logout
                </button>
            </header>

            <div className="container">
                <nav className="nav-tabs">
                    <button className={`nav-btn ${activeTab === 'vote' ? 'active' : ''}`} onClick={() => setActiveTab('vote')}> Monthly Vote</button>
                    <button className={`nav-btn ${activeTab === 'menu' ? 'active' : ''}`} onClick={() => setActiveTab('menu')}> View Menu</button>
                    <button className={`nav-btn ${activeTab === 'feedback' ? 'active' : ''}`} onClick={() => setActiveTab('feedback')}> Weekly Feedback</button>
                </nav>

                {activeTab === 'vote' && (
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Monthly Menu Voting</h2>
                            <p style={{ color: 'var(--text-muted)' }}>
                                Select 7 items from each category. Total: <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{selectedItems.length}</span>/28
                            </p>
                        </div>

                        {/* Category Sub-tabs */}
                        <div className="nav-tabs" style={{ background: 'transparent', border: 'none', marginBottom: '2rem' }}>
                            {['Breakfast', 'Lunch', 'Snack', 'Dinner'].map(cat => {
                                const count = selectedItems.filter(id => {
                                    const item = foodItems.find(f => f._id === id);
                                    return item && item.category === cat;
                                }).length;
                                const isComplete = count === 7;

                                return (
                                    <button
                                        key={cat}
                                        className={`nav-btn ${activeCategory === cat ? 'active' : ''}`}
                                        onClick={() => setActiveCategory(cat)}
                                        style={activeCategory !== cat ? { border: isComplete ? '1px solid var(--success)' : '1px solid var(--glass-border)' } : {}}
                                    >
                                        {cat}
                                        {isComplete && <span style={{ marginLeft: '0.5rem', color: 'var(--success)' }}>✓</span>}
                                        {!isComplete && <span style={{ marginLeft: '0.5rem', opacity: 0.7 }}>({count}/7)</span>}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Veg Section */}
                        {foodItems.filter(item => item.category === activeCategory && (item.dietType === 'Veg' || !item.dietType)).length > 0 && (
                            <div style={{ marginBottom: '3rem' }}>
                                <h4 style={{
                                    marginBottom: '1.5rem',
                                    color: 'var(--success)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '1.2rem'
                                }}>
                                    <span style={{ height: '8px', width: '8px', background: 'currentColor', borderRadius: '50%' }}></span>
                                    Vegetarian Options
                                </h4>
                                <div className="food-grid">
                                    {foodItems.filter(item => item.category === activeCategory && (item.dietType === 'Veg' || !item.dietType)).map(item => (
                                        renderFoodItem(item, selectedItems.includes(item._id), () => toggleMonthlySelection(item._id, item.category))
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Non-Veg Section */}
                        {foodItems.filter(item => item.category === activeCategory && item.dietType === 'Non-Veg').length > 0 && (
                            <div>
                                <h4 style={{
                                    marginBottom: '1.5rem',
                                    color: 'var(--error)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '1.2rem'
                                }}>
                                    <span style={{ height: '8px', width: '8px', background: 'currentColor', borderRadius: '50%' }}></span>
                                    Non-Vegetarian Options
                                </h4>
                                <div className="food-grid">
                                    {foodItems.filter(item => item.category === activeCategory && item.dietType === 'Non-Veg').map(item => (
                                        renderFoodItem(item, selectedItems.includes(item._id), () => toggleMonthlySelection(item._id, item.category))
                                    ))}
                                </div>
                            </div>
                        )}

                        <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center' }}>
                            <button onClick={submitMonthlyVote} className="btn btn-primary" style={{ minWidth: '200px' }}>
                                Submit Final Vote
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'menu' && (
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                            <h3>Current Menu</h3>
                        </div>
                        {menu ? (
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
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => {
                                            const dayItems = menu.items.slice(index * 4, (index + 1) * 4);
                                            return (
                                                <tr key={day}>
                                                    <td style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{day}</td>
                                                    <td>{dayItems[0]?.name || '-'}</td>
                                                    <td>{dayItems[1]?.name || '-'}</td>
                                                    <td>{dayItems[2]?.name || '-'}</td>
                                                    <td>{dayItems[3]?.name || '-'}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No active menu for this month yet.</p>}
                    </div>
                )}

                {activeTab === 'feedback' && (
                    <div style={{ display: 'grid', gap: '2rem' }}>
                        {/* Category Filter for Feedback Section */}
                        <div className="glass-panel" style={{ padding: '1rem', display: 'flex', justifyContent: 'center' }}>
                            <nav className="nav-tabs" style={{ margin: 0 }}>
                                {['Breakfast', 'Lunch', 'Snack', 'Dinner'].map(cat => (
                                    <button
                                        key={cat}
                                        className={`nav-btn ${feedbackCategory === cat ? 'active' : ''}`}
                                        onClick={() => setFeedbackCategory(cat)}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <div className="glass-panel" style={{ padding: '2rem' }}>
                            <h3 style={{ marginBottom: '1.5rem' }}>Weekly Feedback - {feedbackCategory}</h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Select items from this week's <strong>{feedbackCategory}</strong> menu that you didn't like.</p>

                            {menu ? (
                                <div>
                                    <div className="food-grid">
                                        {menu.items
                                            .filter(item => item.category === feedbackCategory)
                                            .map(item => (
                                                renderFoodItem(item, dislikedItems.includes(item._id), () => toggleSelection(item._id, dislikedItems, setDislikedItems, 3))
                                            ))}
                                        {menu.items.filter(item => item.category === feedbackCategory).length === 0 && (
                                            <p style={{ color: 'var(--text-muted)', colSpan: 'full' }}>No {feedbackCategory} items in this weeks menu.</p>
                                        )}
                                    </div>
                                    <button onClick={submitFeedback} className="btn btn-primary" style={{ marginTop: '2rem', background: 'var(--error)', borderColor: 'transparent' }}>
                                        Submit Negative Feedback
                                    </button>
                                </div>
                            ) : <p>No menu to differentiate.</p>}
                        </div>

                        <div className="glass-panel" style={{ padding: '2rem' }}>
                            <h3 style={{ marginBottom: '1.5rem' }}>Vote Replacements - {feedbackCategory}</h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Select items you'd like to see for <strong>{feedbackCategory}</strong> next week.</p>
                            <div className="food-grid">
                                {foodItems
                                    .filter(i => (menu ? !menu.items.find(m => m._id === i._id) : true) && i.category === feedbackCategory)
                                    .map(item => (
                                        renderFoodItem(item, replacementItems.includes(item._id), () => toggleSelection(item._id, replacementItems, setReplacementItems, 3))
                                    ))}
                            </div>
                            <button onClick={submitReplacement} className="btn btn-primary" style={{ marginTop: '2rem', background: 'var(--success)', borderColor: 'transparent' }}>
                                Vote For Replacements
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
