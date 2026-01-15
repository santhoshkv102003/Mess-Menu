const mongoose = require('mongoose');
const FoodItem = require('./models/FoodItem');
const dotenv = require('dotenv');

dotenv.config();

const findSpecificItems = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/mess_menu_db');
        console.log('MongoDB Connected');

        const keywords = ['pongal', 'idly', 'poori', 'upma', 'rava'];

        for (const kw of keywords) {
            const items = await FoodItem.find({ name: { $regex: kw, $options: 'i' } });
            console.log(`\n--- Matches for "${kw}" ---`);
            items.forEach(item => {
                console.log(`- ${item.name} (Category: ${item.category})`);
            });
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

findSpecificItems();
