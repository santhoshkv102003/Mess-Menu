const mongoose = require('mongoose');
const FoodItem = require('./models/FoodItem');
const dotenv = require('dotenv');

dotenv.config();

const checkSpecific = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/mess_menu_db');

        const names = ["Upma", "Vegetable Biryani", "Vegetable Fried Rice", "Idli with Sambar"];
        const items = await FoodItem.find({ name: { $in: names } });

        console.log('--- Current Links ---');
        items.forEach(i => console.log(`${i.name}: ${i.image}`));

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkSpecific();
