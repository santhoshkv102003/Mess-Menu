import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
// import '../App.css';

const AdminDashboard = () => {
    const { logout, user } = useAuth();
    const [activeTab, setActiveTab] = useState('food');
    const [foodItems, setFoodItems] = useState([]);
    const [newItem, setNewItem] = useState({ name: '', category: 'Breakfast', dietType: 'Veg', image: '' });
    const [menuData, setMenuData] = useState(null);

    // Dark mode state
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        fetchFoodItems();
        if (document.documentElement.classList.contains('dark')) {
            setDarkMode(true);
        }
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle('dark');
    };

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

    const handleDeleteItem = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        try {
            await api.delete(`/admin/food-item/${id}`);
            // Optimistically remove from UI
            setFoodItems(prev => prev.filter(item => item._id !== id));
        } catch (err) {
            console.error(err);
            alert('Error deleting item');
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
        <div className="flex bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 h-screen overflow-hidden font-display transition-colors duration-300">
            {/* Sidebar (Admin) */}
            <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full shrink-0 hidden md:flex">
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                            <span className="material-icons-round text-xl">admin_panel_settings</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight">Admin Console</span>
                    </div>
                    <nav className="space-y-1">
                        <button
                            className={`sidebar-item w-full ${activeTab === 'food' ? 'sidebar-item-active' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            onClick={() => setActiveTab('food')}
                        >
                            <span className="material-symbols-outlined">restaurant</span>
                            <span className="font-medium">Manage Food</span>
                        </button>
                        <button
                            className={`sidebar-item w-full ${activeTab === 'menu' ? 'sidebar-item-active' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            onClick={() => setActiveTab('menu')}
                        >
                            <span className="material-symbols-outlined">calendar_month</span>
                            <span className="font-medium">Menu Generator</span>
                        </button>
                    </nav>
                </div>
                <div className="mt-auto p-6 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 overflow-hidden">
                            <span className="material-symbols-outlined">person</span>
                        </div>
                        <div>
                            <p className="text-sm font-semibold truncate max-w-[120px]">{user?.name || 'Admin'}</p>
                            <p className="text-xs text-slate-500">Administrator</p>
                        </div>
                    </div>
                    <button onClick={logout} className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition-colors w-full">
                        <span className="material-symbols-outlined text-[20px]">logout</span>
                        <span className="text-sm font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-0 relative">
                <header className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 p-6 sticky top-0 z-20 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight uppercase">Dashboard</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5 font-medium">Manage food items and generate menus.</p>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-32">

                    {activeTab === 'food' && (
                        <div className="max-w-6xl mx-auto space-y-8">
                            {/* Add Item Panel */}
                            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">add_circle</span>
                                    Add New Food Item
                                </h3>
                                <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Name</label>
                                        <input
                                            type="text"
                                            placeholder="E.g. Masala Dosa"
                                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm"
                                            value={newItem.name}
                                            onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Category</label>
                                        <select
                                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm appearance-none cursor-pointer"
                                            value={newItem.category}
                                            onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                                        >
                                            <option>Breakfast</option>
                                            <option>Lunch</option>
                                            <option>Snack</option>
                                            <option>Dinner</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Diet Type</label>
                                        <select
                                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm appearance-none cursor-pointer"
                                            value={newItem.dietType}
                                            onChange={e => setNewItem({ ...newItem, dietType: e.target.value })}
                                        >
                                            <option>Veg</option>
                                            <option>Non-Veg</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Image URL</label>
                                        <input
                                            type="text"
                                            placeholder="https://..."
                                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm"
                                            value={newItem.image || ''}
                                            onChange={e => setNewItem({ ...newItem, image: e.target.value })}
                                        />
                                    </div>
                                    <button type="submit" className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                                        <span className="material-symbols-outlined text-sm">add</span>
                                        Add
                                    </button>
                                </form>
                            </div>

                            {/* Food Grid */}
                            {/* Food Grid */}
                            <div className="space-y-12">
                                {/* Veg Grid */}
                                <div>
                                    <div className="flex items-center gap-3 mb-6 px-1">
                                        <div className="w-1.5 h-6 bg-secondary rounded-full"></div>
                                        <h3 className="text-lg font-bold flex items-center gap-2">Vegetarian <span className="text-slate-400 text-sm font-normal">({foodItems.filter(i => i.dietType !== 'Non-Veg').length})</span></h3>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                        {foodItems.filter(item => item.dietType !== 'Non-Veg').map(item => (
                                            <div key={item._id} className="group relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                                                <div className="relative aspect-square bg-slate-100 dark:bg-slate-900 overflow-hidden">
                                                    {item.image ? (
                                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-700">
                                                            <span className="material-symbols-outlined text-4xl">restaurant</span>
                                                        </div>
                                                    )}
                                                    <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${item.dietType === 'Non-Veg' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                                                        }`}>
                                                        {item.dietType || 'Veg'}
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteItem(item._id);
                                                        }}
                                                        className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-200 shadow-lg hover:bg-red-600 z-10"
                                                        title="Delete Item"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                                    </button>
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                                                    <div className="absolute bottom-0 left-0 right-0 p-3">
                                                        <p className="text-xs text-slate-300 font-medium mb-0.5 uppercase tracking-wide">{item.category}</p>
                                                        <h3 className="text-white font-bold text-sm leading-tight">{item.name}</h3>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Non-Veg Grid */}
                                {foodItems.some(i => i.dietType === 'Non-Veg') && (
                                    <div>
                                        <div className="flex items-center gap-3 mb-6 px-1">
                                            <div className="w-1.5 h-6 bg-red-500 rounded-full"></div>
                                            <h3 className="text-lg font-bold flex items-center gap-2">Non-Vegetarian <span className="text-slate-400 text-sm font-normal">({foodItems.filter(i => i.dietType === 'Non-Veg').length})</span></h3>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                            {foodItems.filter(item => item.dietType === 'Non-Veg').map(item => (
                                                <div key={item._id} className="group relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                                                    <div className="relative aspect-square bg-slate-100 dark:bg-slate-900 overflow-hidden">
                                                        {item.image ? (
                                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-700">
                                                                <span className="material-symbols-outlined text-4xl">restaurant</span>
                                                            </div>
                                                        )}
                                                        <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${item.dietType === 'Non-Veg' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                                                            }`}>
                                                            {item.dietType || 'Veg'}
                                                        </div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteItem(item._id);
                                                            }}
                                                            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-200 shadow-lg hover:bg-red-600 z-10"
                                                            title="Delete Item"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">delete</span>
                                                        </button>
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                                                        <div className="absolute bottom-0 left-0 right-0 p-3">
                                                            <p className="text-xs text-slate-300 font-medium mb-0.5 uppercase tracking-wide">{item.category}</p>
                                                            <h3 className="text-white font-bold text-sm leading-tight">{item.name}</h3>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'menu' && (
                        <div className="max-w-5xl mx-auto">
                            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                                    <div>
                                        <h3 className="text-xl font-bold">Monthly Menu Generation</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm">Generate optimal menu based on student votes.</p>
                                    </div>
                                    <button
                                        onClick={handleGenerateMonthly}
                                        className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined">auto_awesome</span>
                                        Generate Suggestion
                                    </button>
                                </div>

                                {menuData && (
                                    <div className="animate-fade-in">
                                        <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">calendar_month</span>
                                            Suggested Weekly Menu Plan
                                        </h4>
                                        <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl mb-6">
                                            <table className="w-full text-left text-sm">
                                                <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 uppercase text-xs tracking-wider font-bold">
                                                    <tr>
                                                        <th className="p-4">Day</th>
                                                        <th className="p-4">Breakfast</th>
                                                        <th className="p-4">Lunch</th>
                                                        <th className="p-4">Snack</th>
                                                        <th className="p-4">Dinner</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-slate-700 dark:text-slate-300">
                                                    {menuData.weekMenu && menuData.weekMenu.map((day, index) => (
                                                        <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                            <td className="p-4 font-bold text-primary">{day.day}</td>
                                                            <td className="p-4">{day.breakfast ? <span title={`${menuData.counts[day.breakfast._id]} votes`}>{day.breakfast.name}</span> : '-'}</td>
                                                            <td className="p-4">{day.lunch ? <span title={`${menuData.counts[day.lunch._id]} votes`}>{day.lunch.name}</span> : '-'}</td>
                                                            <td className="p-4">{day.snack ? <span title={`${menuData.counts[day.snack._id]} votes`}>{day.snack.name}</span> : '-'}</td>
                                                            <td className="p-4">{day.dinner ? <span title={`${menuData.counts[day.dinner._id]} votes`}>{day.dinner.name}</span> : '-'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                onClick={handleLockMenu}
                                                className="px-8 py-3 bg-secondary text-white font-bold rounded-xl shadow-lg shadow-secondary/20 hover:scale-105 transition-all flex items-center gap-2"
                                            >
                                                <span className="material-symbols-outlined">lock</span>
                                                Lock & Publish Menu
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </main>

            {/* Dark Mode Toggle */}
            <button
                className="fixed top-6 right-6 z-50 p-2.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur shadow-xl border border-slate-200 dark:border-slate-700 rounded-xl hover:scale-105 transition-transform"
                onClick={toggleDarkMode}
            >
                <span className={`material-symbols-outlined ${darkMode ? 'hidden' : 'block'} text-slate-600`}>dark_mode</span>
                <span className={`material-symbols-outlined ${darkMode ? 'block' : 'hidden'} text-yellow-400`}>light_mode</span>
            </button>
        </div>
    );
};

export default AdminDashboard;
