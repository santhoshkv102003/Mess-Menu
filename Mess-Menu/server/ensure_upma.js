const mongoose = require('mongoose');
const Menu = require('./models/Menu');
const FoodItem = require('./models/FoodItem');
const dotenv = require('dotenv');

dotenv.config();

const ensureUpma = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mess_menu_db';
        await mongoose.connect(MONGODB_URI);
        const month = new Date().toISOString().slice(0, 7);
        const menu = await Menu.findOne({ month }).populate('items');

        if (!menu) {
            console.log('No menu found');
            process.exit(0);
        }

        const upma = await FoodItem.findOne({ name: 'Upma' });
        if (!upma) {
            console.log('Upma food item not found in DB');
            process.exit(1);
        }

        const isPresent = menu.items.some(i => i._id.equals(upma._id));
        if (isPresent) {
            console.log('Upma is already in the menu');
        } else {
            console.log('Upma missing. Swapping a breakfast item...');
            // Find a breakfast item to remove
            const breakfastIndex = menu.items.findIndex(i => i.category === 'Breakfast' && !i._id.equals(upma._id));
            if (breakfastIndex !== -1) {
                const removed = menu.items[breakfastIndex];
                menu.items[breakfastIndex] = upma._id; // Replace
                await menu.save();
                console.log(`Replaced "${removed.name}" with "Upma"`);
            } else {
                console.log('No breakfast item found to swap (unexpected)');
            }
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

ensureUpma();
