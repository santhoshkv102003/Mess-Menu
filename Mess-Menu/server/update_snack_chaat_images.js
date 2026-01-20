const mongoose = require('mongoose');
const FoodItem = require('./models/FoodItem');
const dotenv = require('dotenv');

dotenv.config();

const updateSnackChaatItems = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/mess_menu_db');
        console.log('MongoDB Connected');

        const updates = [
            { keyword: 'Mixture', image: '/images/mixture.jpg' },
            { keyword: 'Murukku', image: '/images/murukku.jpg' },
            { keyword: 'Paniyaram', image: '/images/paniyaram.jpg' },
            { keyword: 'Corn', image: '/images/sweet_corn_chaat.jpg' },
            { keyword: 'Bread Omelette', image: '/images/bread_omelette.jpg' }
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

        console.log('Snack/Chaat images updated successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

updateSnackChaatItems();
