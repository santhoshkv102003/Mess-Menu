const mongoose = require('mongoose');
const FoodItem = require('./models/FoodItem');
const dotenv = require('dotenv');

dotenv.config();

const updateDietType = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mess_menu_db';
        await mongoose.connect(MONGODB_URI);

        const nonVegKeywords = ['Chicken', 'Fish', 'Egg', 'Non-Veg', 'Mutton', 'Prawn', 'Omelette', 'Biryani'];
        // Note: Veg Biryani exists, need to be careful.

        const items = await FoodItem.find({});

        for (const item of items) {
            const nameLower = item.name.toLowerCase();
            let isNonVeg = false;

            // Explicit checks
            if (nameLower.includes('veg') && !nameLower.includes('non-veg') && !nameLower.includes('egg')) {
                // likely veg
                isNonVeg = false;
            } else {
                // Check non-veg keywords
                for (const kw of nonVegKeywords) {
                    if (nameLower.includes(kw.toLowerCase())) {
                        isNonVeg = true;
                        break;
                    }
                }
            }

            // Correction for specific known items if logic above fails or is ambiguous
            if (nameLower.includes('veg biryani') || nameLower.includes('vegetable biryani')) isNonVeg = false;
            if (nameLower.includes('veg fried rice') || nameLower.includes('vegetable fried rice')) isNonVeg = false;
            if (nameLower.includes('veg noodles')) isNonVeg = false;

            const newType = isNonVeg ? 'Non-Veg' : 'Veg';
            if (item.dietType !== newType) {
                console.log(`Updating "${item.name}" -> ${newType}`);
                item.dietType = newType;
                await item.save();
            }
        }

        console.log('Update Complete');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

updateDietType();
