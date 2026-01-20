const Vote = require('../models/Vote');
const Menu = require('../models/Menu');

exports.castMonthlyVote = async (req, res) => {
    try {
        const { month, selectedItems } = req.body;
        const studentId = req.user.id;

        if (selectedItems.length !== 28) {
            return res.status(400).json({ message: 'You must select exactly 28 items' });
        }

        let existingVote = await Vote.findOne({ student: studentId, month, type: 'monthly_selection' });
        if (existingVote) {
            // Update existing vote or block? Usually update is allowed before deadline. 
            // Requirement says "Select... for monthly menu voting".
            // Let's allow update.
            existingVote.items = selectedItems;
            await existingVote.save();
            return res.json({ message: 'Vote updated' });
        }

        const newVote = new Vote({
            student: studentId,
            month,
            type: 'monthly_selection',
            items: selectedItems
        });

        await newVote.save();
        res.status(201).json({ message: 'Vote cast successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Error casting vote', error: error.message });
    }
};

exports.giveFeedback = async (req, res) => {
    try {
        const { month, week, dislikedItems } = req.body; // dislikedItems: IDs
        const studentId = req.user.id;

        if (dislikedItems.length > 3) {
            return res.status(400).json({ message: 'You can select at most 3 disliked items' });
        }

        let existingVote = await Vote.findOne({ student: studentId, month, week, type: 'feedback' });
        if (existingVote) {
            existingVote.items = dislikedItems;
            await existingVote.save();
            return res.json({ message: 'Feedback updated' });
        }

        const newVote = new Vote({
            student: studentId,
            month,
            week,
            type: 'feedback',
            items: dislikedItems
        });

        await newVote.save();
        res.status(201).json({ message: 'Feedback submitted' });

    } catch (error) {
        res.status(500).json({ message: 'Error submitting feedback', error: error.message });
    }
};

exports.voteReplacement = async (req, res) => {
    try {
        const { month, week, replacementItems } = req.body;
        const studentId = req.user.id;

        if (replacementItems.length > 3) {
            return res.status(400).json({ message: 'You can select at most 3 replacement items' });
        }

        let existingVote = await Vote.findOne({ student: studentId, month, week, type: 'replacement' });
        if (existingVote) {
            existingVote.items = replacementItems;
            await existingVote.save();
            return res.json({ message: 'Replacement vote updated' });
        }

        const newVote = new Vote({
            student: studentId,
            month,
            week,
            type: 'replacement',
            items: replacementItems
        });

        await newVote.save();
        res.status(201).json({ message: 'Replacement vote submitted' });
    } catch (error) {
        res.status(500).json({ message: 'Error voting for replacement', error: error.message });
    }
};

exports.getMenu = async (req, res) => {
    try {
        const { month, week = 1 } = req.query; // Default to week 1 if not provided
        // Find the active menu for the specific week
        const menu = await Menu.findOne({ month, week }).populate('items');

        if (!menu) {
            return res.status(404).json({ message: 'Menu not found for this period' });
        }
        res.json(menu);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching menu', error: error.message });
    }
};
