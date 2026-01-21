const FoodItem = require('../models/FoodItem');
const Menu = require('../models/Menu');
const Vote = require('../models/Vote');

exports.addFoodItem = async (req, res) => {
    try {
        const { name, category, image, dietType } = req.body;
        const newItem = new FoodItem({ name, category, image, dietType });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: 'Error adding food item', error: error.message });
    }
};

exports.deleteFoodItem = async (req, res) => {
    try {
        const { id } = req.params;
        await FoodItem.findByIdAndDelete(id);
        res.json({ message: 'Food item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting food item', error: error.message });
    }
};

exports.getFoodItems = async (req, res) => {
    try {
        const items = await FoodItem.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching items', error: error.message });
    }
};

exports.lockMenu = async (req, res) => {
    try {
        const { month, items } = req.body; // items: Array of FoodItem IDs

        if (items.length !== 28) {
            return res.status(400).json({ message: 'Menu must have exactly 28 items' });
        }

        // Use findOneAndUpdate with upsert to update existing menu or create new one
        // This prevents duplicate menus for the same month/week
        const menu = await Menu.findOneAndUpdate(
            { month, week: 1 }, // Find menu for this month and week
            {
                month,
                week: 1,
                items,
                isLocked: true
            },
            {
                new: true, // Return the updated document
                upsert: true, // Create if doesn't exist
                runValidators: true // Run schema validators
            }
        );

        res.status(201).json({ message: 'Monthly menu locked', menu });
    } catch (error) {
        res.status(500).json({ message: 'Error locking menu', error: error.message });
    }
};

exports.getVotes = async (req, res) => {
    try {
        const { month, week } = req.query;
        // Logic to aggregate votes can be complex.
        // For now returning raw votes.
        const votes = await Vote.find({ month });
        res.json(votes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching votes', error: error.message });
    }
};

exports.generateMonthlyMenu = async (req, res) => {
    try {
        const { month } = req.query;
        const votes = await Vote.find({ month, type: 'monthly_selection' });

        const itemCounts = {};
        votes.forEach(vote => {
            vote.items.forEach(itemId => {
                itemCounts[itemId] = (itemCounts[itemId] || 0) + 1;
            });
        });

        const allItems = await FoodItem.find();
        const categories = { 'Breakfast': [], 'Lunch': [], 'Snack': [], 'Dinner': [] };

        allItems.forEach(item => {
            if (categories[item.category]) {
                categories[item.category].push({
                    ...item.toObject(),
                    voteCount: itemCounts[item._id] || 0
                });
            }
        });

        // Sort by votes
        Object.keys(categories).forEach(cat => {
            categories[cat].sort((a, b) => b.voteCount - a.voteCount);
        });

        const topItems = {
            'Breakfast': categories['Breakfast'].slice(0, 7),
            'Lunch': categories['Lunch'].slice(0, 7),
            'Snack': categories['Snack'].slice(0, 7),
            'Dinner': categories['Dinner'].slice(0, 7)
        };

        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const weekMenu = [];
        const flatList = [];

        // Build the flat list in the correct order: [Mon-B, Mon-L, Mon-S, Mon-D, Tue-B, Tue-L, ...]
        for (let i = 0; i < 7; i++) {
            const dayMenu = {
                day: days[i],
                breakfast: topItems['Breakfast'][i] || null,
                lunch: topItems['Lunch'][i] || null,
                snack: topItems['Snack'][i] || null,
                dinner: topItems['Dinner'][i] || null
            };
            weekMenu.push(dayMenu);

            // Add items in order: breakfast, lunch, snack, dinner for each day
            // CRITICAL: Push all items including nulls to maintain exact 28-item structure
            flatList.push(dayMenu.breakfast);
            flatList.push(dayMenu.lunch);
            flatList.push(dayMenu.snack);
            flatList.push(dayMenu.dinner);
        }

        res.json({ suggestedItems: flatList, weekMenu, counts: itemCounts });
    } catch (error) {
        res.status(500).json({ message: 'Error generating menu', error: error.message });
    }
};

exports.generateWeeklyReplacement = async (req, res) => {
    try {
        const { month, week } = req.query; // week: current week logic applied to

        // 1. Find Disliked
        const feedbackVotes = await Vote.find({ month, week, type: 'feedback' });
        const dislikeCounts = {};
        feedbackVotes.forEach(vote => {
            vote.items.forEach(itemId => {
                dislikeCounts[itemId] = (dislikeCounts[itemId] || 0) + 1;
            });
        });
        const topDisliked = Object.keys(dislikeCounts).sort((a, b) => dislikeCounts[b] - dislikeCounts[a]).slice(0, 3);

        // 2. Find Replacements
        const replacementVotes = await Vote.find({ month, week, type: 'replacement' });
        const replacementCounts = {};
        replacementVotes.forEach(vote => {
            vote.items.forEach(itemId => {
                replacementCounts[itemId] = (replacementCounts[itemId] || 0) + 1;
            });
        });
        const topReplacements = Object.keys(replacementCounts).sort((a, b) => replacementCounts[b] - replacementCounts[a]).slice(0, 3);

        res.json({
            disliked: topDisliked,
            replacements: topReplacements,
            dislikeCounts,
            replacementCounts
        });

    } catch (error) {
        res.status(500).json({ message: 'Error generating replacement', error: error.message });
    }
};

exports.getFoodAnalytics = async (req, res) => {
    try {
        const { month } = req.query; // Expects "YYYY-MM", defaults to current if needed, but let's make it optional or handle in frontend

        // If no month provided, maybe default to current or return all?
        // Let's assume month is passed or we default to current month
        const targetMonth = month || new Date().toISOString().slice(0, 7);

        const votes = await Vote.find({ month: targetMonth, type: 'monthly_selection' });

        const itemCounts = {};
        votes.forEach(vote => {
            vote.items.forEach(itemId => {
                itemCounts[itemId] = (itemCounts[itemId] || 0) + 1;
            });
        });

        const allItems = await FoodItem.find();

        // return list with vote counts
        const analyticsData = allItems.map(item => ({
            ...item.toObject(),
            voteCount: itemCounts[item._id] || 0
        }));

        // Sort by vote count descending
        analyticsData.sort((a, b) => b.voteCount - a.voteCount);

        res.json(analyticsData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching analytics', error: error.message });
    }
};
