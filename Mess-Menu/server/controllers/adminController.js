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

        const newMenu = new Menu({
            month,
            week: 1,
            items,
            isLocked: true
        });

        await newMenu.save();
        res.status(201).json({ message: 'Monthly menu locked', menu: newMenu });
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

        for (let i = 0; i < 7; i++) {
            const dayMenu = {
                day: days[i],
                breakfast: topItems['Breakfast'][i] || null,
                lunch: topItems['Lunch'][i] || null,
                snack: topItems['Snack'][i] || null,
                dinner: topItems['Dinner'][i] || null
            };
            weekMenu.push(dayMenu);
            if (dayMenu.breakfast) flatList.push(dayMenu.breakfast);
            if (dayMenu.lunch) flatList.push(dayMenu.lunch);
            if (dayMenu.snack) flatList.push(dayMenu.snack);
            if (dayMenu.dinner) flatList.push(dayMenu.dinner);
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
