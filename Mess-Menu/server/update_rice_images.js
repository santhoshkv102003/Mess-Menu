const mongoose = require('mongoose');
const FoodItem = require('./models/FoodItem');
const dotenv = require('dotenv');

dotenv.config();

const updateRiceImages = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/mess_menu_db');
        console.log('MongoDB Connected');

        const updates = [
            { keyword: 'Veg Meals', image: '/images/veg_meals.jpg' },
            { keyword: 'Sambar Rice', image: '/images/sambar_rice.jpg' },
            { keyword: 'Rasam Rice', image: '/images/rasam_rice.jpg' },
            { keyword: 'Curd Rice', image: '/images/curd_rice.jpg' },
            { keyword: 'Lemon Rice', image: '/images/lemon_rice.jpg' }
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

        console.log('Rice images updated successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

updateRiceImages();
