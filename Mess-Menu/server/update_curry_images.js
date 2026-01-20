const mongoose = require('mongoose');
const FoodItem = require('./models/FoodItem');
const dotenv = require('dotenv');

dotenv.config();

const updateCurryImages = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/mess_menu_db');
        console.log('MongoDB Connected');

        const updates = [
            { keyword: 'Kootu', image: '/images/kootu_rice.jpg' },
            { keyword: 'Tomato', image: '/images/tomato_rice.jpg' },
            { keyword: 'Kurma', image: '/images/veg_kurma_rice.jpg' },
            { keyword: 'Chicken Curry', image: '/images/chicken_curry_rice.jpg' },
            { keyword: 'Biryani', image: '/images/chicken_biryani.jpg' }
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

        console.log('Curry and Rice images updated successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

updateCurryImages();
