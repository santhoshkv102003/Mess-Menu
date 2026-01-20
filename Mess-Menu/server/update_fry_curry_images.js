const mongoose = require('mongoose');
const FoodItem = require('./models/FoodItem');
const dotenv = require('dotenv');

dotenv.config();

const updateFryCurryImages = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/mess_menu_db');
        console.log('MongoDB Connected');

        const updates = [
            { keyword: 'Chicken Fry', image: '/images/chicken_fry.jpg' },
            { keyword: 'Fish Curry', image: '/images/fish_curry_rice.jpg' },
            { keyword: 'Fish Fry', image: '/images/fish_fry.jpg' },
            { keyword: 'Egg Curry', image: '/images/egg_curry_rice.jpg' }
        ];

        for (const update of updates) {
            const items = await FoodItem.find({ name: { $regex: update.keyword, $options: 'i' } });

            if (items.length === 0) {
                console.log(`No items found for keyword "${update.keyword}"`);
            } else {
                for (const item of items) {
                    item.image = update.image;
                    await item.save();
                    console.log(`Updated image for "${item.name}" to "${update.image}"`);
                }
            }
        }

        console.log('Fry and Curry images updated successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

updateFryCurryImages();
