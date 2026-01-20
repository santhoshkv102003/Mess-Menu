import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

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

    // Dark mode state
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        fetchFoodItems();
        fetchMenu();
        if (document.documentElement.classList.contains('dark')) {
            setDarkMode(true);
        }
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        if (!darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

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
            setDislikedItems([]);
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
            setReplacementItems([]);
        } catch (err) {
            alert('Error submitting replacement vote');
        }
    };

    // Helper to get current category count for progress bar
    const getCurrentCategoryCount = () => {
        return selectedItems.filter(id => {
            const item = foodItems.find(f => f._id === id);
            return item && item.category === activeCategory;
        }).length;
    };

    const renderFoodCard = (item, isSelected, onClick, isVotedView = false) => (
        <div
            key={item._id}
            className={`group relative bg-white dark:bg-slate-800 border ${isSelected ? 'border-2 border-primary' : 'border-slate-200 dark:border-slate-700'} rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200`}
            onClick={onClick}
        >
            <div className="relative aspect-square overflow-hidden cursor-pointer">
                {item.image ? (
                    <img
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        src={item.image}
                    />
                ) : (
                    <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                        <span className="material-symbols-outlined text-4xl">restaurant</span>
                    </div>
                )}

                {isSelected && (
                    <div className="absolute top-2 right-2 bg-primary text-white p-0.5 rounded-full shadow-lg">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    </div>
                )}
            </div>

            <div className={`p-2.5 ${isSelected ? 'bg-primary/5 dark:bg-primary/10' : 'bg-white dark:bg-slate-800'}`}>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate mb-2">{item.name}</h3>
                <button className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all duration-200 ${isSelected
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-700/50 hover:bg-primary/10 hover:text-primary border border-slate-200 dark:border-slate-600'
                    }`}>
                    {isSelected ? (
                        <>
                            <span className="material-symbols-outlined text-[18px]">check</span>
                            <span className="text-xs font-black uppercase tracking-tight">{isVotedView ? 'Selected' : 'Voted'}</span>
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-[18px]">add_circle</span>
                            <span className="text-xs font-black uppercase tracking-tight">{isVotedView ? 'Select' : 'Vote'}</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 overflow-hidden font-display">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen shrink-0 hidden md:flex">
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                            <span className="material-icons-round text-xl">restaurant</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight">Smart Mess</span>
                    </div>
                    <nav className="space-y-1">
                        <button className={`sidebar-item w-full ${activeTab === 'vote' ? 'sidebar-item-active' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`} onClick={() => setActiveTab('vote')}>
                            <span className="material-symbols-outlined">how_to_vote</span>
                            <span className="font-medium">Vote</span>
                        </button>
                        <button className={`sidebar-item w-full ${activeTab === 'menu' ? 'sidebar-item-active' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`} onClick={() => setActiveTab('menu')}>
                            <span className="material-symbols-outlined">restaurant_menu</span>
                            <span className="font-medium">Menu</span>
                        </button>
                        <button className={`sidebar-item w-full ${activeTab === 'feedback' ? 'sidebar-item-active' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`} onClick={() => setActiveTab('feedback')}>
                            <span className="material-symbols-outlined">chat_bubble</span>
                            <span className="font-medium">Feedback</span>
                        </button>
                    </nav>
                </div>
                <div className="mt-auto p-6 border-t border-slate-200 dark:border-slate-800">
                    <button
                        onClick={toggleDarkMode}
                        className="flex items-center gap-3 w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors mb-4"
                    >
                        <span className="material-symbols-outlined">{darkMode ? 'light_mode' : 'dark_mode'}</span>
                        <span className="text-sm font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 overflow-hidden">
                            <span className="material-symbols-outlined">person</span>
                        </div>
                        <div>
                            <p className="text-sm font-semibold truncate max-w-[120px]">{user?.name || 'Student'}</p>
                            <p className="text-xs text-slate-500">Student</p>
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
                {/* Header */}
                <header className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 p-6 sticky top-0 z-20">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-black tracking-tight uppercase">Rapid Selection Board</h1>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5 font-medium">Quick tap to vote for next month's menu.</p>
                            </div>
                            {/* Mobile Dark Mode Toggle */}
                            <button
                                onClick={toggleDarkMode}
                                className="md:hidden p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                            >
                                <span className="material-symbols-outlined">{darkMode ? 'light_mode' : 'dark_mode'}</span>
                            </button>
                        </div>

                        {(activeTab === 'vote' || activeTab === 'feedback') && (
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                {activeTab === 'vote' && (
                                    <div className="w-full sm:w-auto">
                                        <div className="flex items-center justify-between sm:justify-end gap-3 mb-2">
                                            <span className="text-xs font-bold text-primary uppercase tracking-wider">{getCurrentCategoryCount()} of 7 Selected</span>
                                            <span className="text-xs font-bold text-slate-400 uppercase">{activeCategory}</span>
                                        </div>
                                        <div className="w-full sm:w-56 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="bg-primary h-full rounded-full transition-all duration-300"
                                                style={{ width: `${(getCurrentCategoryCount() / 7) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
                                    {['Breakfast', 'Lunch', 'Snack', 'Dinner'].map(cat => {
                                        const isSelected = (activeTab === 'vote' ? activeCategory : feedbackCategory) === cat;
                                        return (
                                            <button
                                                key={cat}
                                                onClick={() => activeTab === 'vote' ? setActiveCategory(cat) : setFeedbackCategory(cat)}
                                                className={`flex-1 sm:flex-none px-5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${isSelected
                                                    ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white'
                                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                                    }`}
                                            >
                                                {cat}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-hide pb-32">

                    {/* VOTING TAB */}
                    {activeTab === 'vote' && (
                        <div className="space-y-10">
                            {/* Vegetarian Section */}
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-1.5 h-6 bg-secondary rounded-full"></div>
                                    <h2 className="text-base font-black uppercase tracking-widest text-slate-500">Vegetarian</h2>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
                                    {foodItems
                                        .filter(item => item.category === activeCategory && (item.dietType === 'Veg' || !item.dietType))
                                        .map(item => renderFoodCard(
                                            item,
                                            selectedItems.includes(item._id),
                                            () => toggleMonthlySelection(item._id, item.category)
                                        ))
                                    }
                                    {foodItems.filter(item => item.category === activeCategory && (item.dietType === 'Veg' || !item.dietType)).length === 0 && (
                                        <p className="text-slate-400 text-sm">No vegetarian items found.</p>
                                    )}
                                </div>
                            </div>

                            {/* Non-Vegetarian Section */}
                            {foodItems.filter(item => item.category === activeCategory && item.dietType === 'Non-Veg').length > 0 && (
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-1.5 h-6 bg-red-500 rounded-full"></div>
                                        <h2 className="text-base font-black uppercase tracking-widest text-slate-500">Non-Vegetarian</h2>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
                                        {foodItems
                                            .filter(item => item.category === activeCategory && item.dietType === 'Non-Veg')
                                            .map(item => renderFoodCard(
                                                item,
                                                selectedItems.includes(item._id),
                                                () => toggleMonthlySelection(item._id, item.category)
                                            ))
                                        }
                                    </div>
                                </div>
                            )}

                            {/* Submit Button (Floating) */}
                            <div className="fixed bottom-8 right-8 z-30">
                                <button
                                    onClick={submitMonthlyVote}
                                    className="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-primary/40 flex items-center gap-3 transform transition-all hover:scale-105 active:scale-95"
                                >
                                    <span className="material-symbols-outlined">send</span>
                                    <span>Submit Final Vote</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* MENU TAB */}
                    {activeTab === 'menu' && (
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                                    <h2 className="text-xl font-bold">Menu for {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                                </div>
                                {menu ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-slate-50 dark:bg-slate-900/50">
                                                <tr>
                                                    <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Day</th>
                                                    <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Breakfast</th>
                                                    <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Lunch</th>
                                                    <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Snack</th>
                                                    <th className="p-4 font-bold text-slate-500 uppercase text-xs tracking-wider">Dinner</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => {
                                                    const dayItems = menu.items.slice(index * 4, (index + 1) * 4);
                                                    return (
                                                        <tr key={day} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                            <td className="p-4 font-bold text-primary">{day}</td>
                                                            <td className="p-4">{dayItems[0]?.name || '-'}</td>
                                                            <td className="p-4">{dayItems[1]?.name || '-'}</td>
                                                            <td className="p-4">{dayItems[2]?.name || '-'}</td>
                                                            <td className="p-4">{dayItems[3]?.name || '-'}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="p-12 text-center text-slate-500">
                                        <span className="material-symbols-outlined text-4xl mb-2">restaurant_menu</span>
                                        <p>No menu active for this month.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* FEEDBACK TAB */}
                    {activeTab === 'feedback' && (
                        <div className="space-y-12">
                            {/* Negative Feedback Section */}
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-1.5 h-6 bg-red-400 rounded-full"></div>
                                    <div>
                                        <h2 className="text-base font-black uppercase tracking-widest text-slate-500">Dislike Items</h2>
                                        <p className="text-xs text-slate-400">Select items you didn't enjoy this week</p>
                                    </div>
                                </div>

                                {menu ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                                        {menu.items
                                            .filter(item => item.category === feedbackCategory)
                                            .map(item => renderFoodCard(
                                                item,
                                                dislikedItems.includes(item._id),
                                                () => toggleSelection(item._id, dislikedItems, setDislikedItems, 3),
                                                true
                                            ))
                                        }
                                        {menu.items.filter(item => item.category === feedbackCategory).length === 0 && (
                                            <p className="text-slate-400">No items in the menu for this category.</p>
                                        )}
                                    </div>
                                ) : <p className="text-slate-400">No menu available.</p>}

                                {dislikedItems.length > 0 && (
                                    <button
                                        onClick={submitFeedback}
                                        className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold uppercase tracking-wide text-xs shadow-lg shadow-red-500/20 transition-all"
                                    >
                                        Submit Negative Feedback
                                    </button>
                                )}
                            </div>

                            {/* Replacement Vote Section */}
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-1.5 h-6 bg-secondary rounded-full"></div>
                                    <div>
                                        <h2 className="text-base font-black uppercase tracking-widest text-slate-500">Vote Replacements</h2>
                                        <p className="text-xs text-slate-400">Vote for what you want next week</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                                    {foodItems
                                        .filter(i => (menu ? !menu.items.find(m => m._id === i._id) : true) && i.category === feedbackCategory)
                                        .map(item => renderFoodCard(
                                            item,
                                            replacementItems.includes(item._id),
                                            () => toggleSelection(item._id, replacementItems, setReplacementItems, 3),
                                            true
                                        ))
                                    }
                                </div>
                                {replacementItems.length > 0 && (
                                    <button
                                        onClick={submitReplacement}
                                        className="mt-6 bg-secondary hover:bg-green-600 text-white px-6 py-2.5 rounded-xl font-bold uppercase tracking-wide text-xs shadow-lg shadow-green-500/20 transition-all"
                                    >
                                        Submit Replacement Vote
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </main>
            {/* Removed the fixed floating "Dark Mode" button from here */}
        </div>
    );
};

export default StudentDashboard;
