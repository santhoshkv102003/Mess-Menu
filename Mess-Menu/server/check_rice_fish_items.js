const mongoose = require('mongoose');
const FoodItem = require('./models/FoodItem');
const dotenv = require('dotenv');

dotenv.config();

const checkItems = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/mess_menu_db');
        console.log('MongoDB Connected');

        const keywords = ['Chicken Fried Rice', 'Fish Gravy with Rice', 'Egg Fried Rice'];

        for (const kw of keywords) {
            // Exact match attempt first
            let items = await FoodItem.find({ name: kw });
            if (items.length > 0) {
                console.log(`\n--- Exact Match for "${kw}" ---`);
                items.forEach(item => {
                    console.log(`- ${item.name} (Category: ${item.category}, Image: ${item.image})`);
                });
            } else {
                console.log(`\n--- No Exact Match for "${kw}", trying regex ---`);
                const regex = new RegExp(kw.replace(/ /g, '.*'), 'i'); // Loose matching
                items = await FoodItem.find({ name: { $regex: regex } });
                items.forEach(item => {
                    console.log(`- ${item.name} (Category: ${item.category}, Image: ${item.image})`);
                });
            }
        }

        // Also search for "Egg" generally to see if "Egg Fried Rice" exists under a different name
        const eggItems = await FoodItem.find({ name: /Egg/i });
        console.log('\n--- All Egg Items ---');
        eggItems.forEach(item => console.log(`- ${item.name}`));

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkItems();
