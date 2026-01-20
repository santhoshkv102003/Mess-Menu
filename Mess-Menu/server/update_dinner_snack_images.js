const mongoose = require('mongoose');
const FoodItem = require('./models/FoodItem');
const dotenv = require('dotenv');

dotenv.config();

const updateDinnerSnackItems = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/mess_menu_db');
        console.log('MongoDB Connected');

        const updates = [
            { keyword: 'Puff', image: '/images/egg_puff.jpg' },
            { keyword: 'Chapati', image: '/images/chapati_veg_kurma.jpg' },
            { keyword: 'Parotta', image: '/images/parotta_veg_salna.jpg' },
            { keyword: 'Idiyappam', image: '/images/idiyappam_kurma.jpg' },
            { keyword: 'Lemon Sevai', image: '/images/lemon_sevai.jpg' }
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

        console.log('Dinner/Snack images updated successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

updateDinnerSnackItems();
