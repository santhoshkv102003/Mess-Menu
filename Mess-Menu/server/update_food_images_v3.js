const mongoose = require('mongoose');
const FoodItem = require('./models/FoodItem');
const dotenv = require('dotenv');

dotenv.config();

const updateImagesV3 = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/mess_menu_db');
        console.log('MongoDB Connected');

        // User Requests:
        // Appam with Coconut Milk
        // Puttu with Kadala Curry
        // Uttapam (Onion / Veg)
        // Egg Omelette
        // Idli with Sambar

        const updates = [
            { keyword: 'Appam', image: '/images/appam_coconut_milk.jpg' },
            { keyword: 'Puttu', image: '/images/puttu_kadala_curry.jpg' },
            { keyword: 'Uttapam', image: '/images/veg_uttapam.jpg' },
            { keyword: 'Omelette', image: '/images/egg_omelette.jpg' },
            { keyword: 'Idli', image: '/images/idli_sambar_new.jpg' }
        ];

        for (const update of updates) {
            // Find items containing the keyword (case-insensitive)
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

        console.log('Images V3 updated successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

updateImagesV3();
