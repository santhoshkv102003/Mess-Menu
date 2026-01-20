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
                pattern: /Masala Dosa/i,
                image: '/images/masala_dosa.jpg'
            },
            {
                pattern: /Rava Dosa/i,
                image: '/images/rava_dosa.jpg'
            },
            {
                pattern: /Semiya Upma/i,
                image: '/images/semiya_upma.jpg'
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
