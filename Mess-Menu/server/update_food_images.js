const mongoose = require('mongoose');
const FoodItem = require('./models/FoodItem');
const dotenv = require('dotenv');

dotenv.config();

const updateImages = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/mess_menu_db');
        console.log('MongoDB Connected');

        const updates = [
            { name: 'Idly', image: '/images/idly_sambar.jpg' },
            { name: 'Plain Dosa', image: '/images/plain_dosa.jpg' },
            { name: 'Masala Dosa', image: '/images/masala_dosa.jpg' }
        ];

        for (const update of updates) {
            // Find by name using regex to be more flexible with case/partial matches if needed, 
            // but here exact match or "contains" is safer depending on actual existing names.
            // Using regex to match "Idly" safely even if it's "Idly & Sambar" or similar in DB, 
            // but let's stick to simple "includes" logic or exact match based on user request.
            // The user said "set image idly and sambar", "plain dosa", "masala dosa".
            // Let's first search for items containing these strings.

            const regex = new RegExp(update.name, 'i');
            const items = await FoodItem.find({ name: regex });

            if (items.length === 0) {
                console.log(`No items found for "${update.name}"`);
            } else {
                for (const item of items) {
                    item.image = update.image;
                    await item.save();
                    console.log(`Updated image for "${item.name}" to "${update.image}"`);
                }
            }
        }

        console.log('Images updated successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

updateImages();
