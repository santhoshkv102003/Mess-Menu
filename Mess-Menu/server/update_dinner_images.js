const mongoose = require('mongoose');
const FoodItem = require('./models/FoodItem');
const dotenv = require('dotenv');

dotenv.config();

const updateImages = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/mess_menu_db');
        console.log('MongoDB Connected');

        const updates = [
            {
                pattern: /Vegetable Fried Rice/i,
                image: '/images/veg_fried_rice.jpg'
            },
            {
                pattern: /Parotta/i,
                image: '/images/parotta_chicken_salna.jpg' // User called it "dosparotta", likely Parotta in DB
            },
            {
                pattern: /Veg Noodles/i,
                image: '/images/veg_noodles.jpg'
            },
            {
                pattern: /Chapati with Chicken Gravy/i,
                image: '/images/chapati_chicken_gravy.jpg'
            }
        ];

        for (const update of updates) {
            const result = await FoodItem.findOneAndUpdate(
                { name: { $regex: update.pattern } },
                { $set: { image: update.image } },
                { new: true }
            );

            if (result) {
                console.log(`Updated "${result.name}" with image "${result.image}"`);
            } else {
                console.log(`Could not find item matching pattern: ${update.pattern}`);
            }
        }

        console.log('--- Update Complete ---');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

updateImages();
