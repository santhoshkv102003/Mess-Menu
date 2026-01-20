const mongoose = require('mongoose');
const FoodItem = require('./models/FoodItem');
const dotenv = require('dotenv');

dotenv.config();

const updateImages = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/mess_menu_db');
        console.log('MongoDB Connected');

        const updates = [
            { name: 'Chicken Fried Rice', image: '/images/chicken_fried_rice.jpg' },
            { name: 'Fish Gravy with Rice', image: '/images/fish_gravy_with_rice.jpg' },
            { name: 'Egg Fried Rice', image: '/images/egg_fried_rice.jpg' }
        ];

        for (const update of updates) {
            const result = await FoodItem.findOneAndUpdate(
                { name: update.name },
                { image: update.image },
                { new: true }
            );

            if (result) {
                console.log(`Updated ${update.name} with image: ${result.image}`);
            } else {
                console.log(`Food item not found: ${update.name}`);
                // Try loose match if exact match fails
                const regex = new RegExp(update.name.replace(/ /g, '.*'), 'i');
                const fuzzyResult = await FoodItem.findOneAndUpdate(
                    { name: { $regex: regex } },
                    { image: update.image },
                    { new: true }
                );
                if (fuzzyResult) {
                    console.log(`Updated (Fuzzy Match) ${fuzzyResult.name} with image: ${fuzzyResult.image}`);
                } else {
                    console.log(`Food item not found (even with fuzzy match): ${update.name}`);
                }
            }
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

updateImages();
