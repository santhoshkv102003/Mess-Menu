const mongoose = require('mongoose');
const FoodItem = require('./models/FoodItem');
const dotenv = require('dotenv');

dotenv.config();

const checkDietType = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mess_menu_db';
        await mongoose.connect(MONGODB_URI);

        const items = await FoodItem.find({});
        const veg = items.filter(i => i.dietType === 'Veg');
        const nonVeg = items.filter(i => i.dietType === 'Non-Veg');
        const unknown = items.filter(i => !['Veg', 'Non-Veg'].includes(i.dietType));

        console.log(`Total: ${items.length}`);
        console.log(`Veg: ${veg.length}`);
        console.log(`Non-Veg: ${nonVeg.length}`);
        console.log(`Unknown/Missing: ${unknown.length}`);

        if (unknown.length > 0) {
            console.log('Sample Unknown:', unknown.slice(0, 3).map(i => i.name));
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkDietType();
