const mongoose = require('mongoose');
const FoodItem = require('./models/FoodItem');
const dotenv = require('dotenv');

dotenv.config();

const updateVegBiryani = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/mess_menu_db');
        console.log('MongoDB Connected');

        // Update specifically Vegetable Biryani
        const keyword = 'Vegetable Biryani';
        const imagePath = '/images/veg_biryani.jpg';

        const items = await FoodItem.find({ name: { $regex: keyword, $options: 'i' } });

        if (items.length === 0) {
            console.log(`No items found for keyword "${keyword}"`);
        } else {
            for (const item of items) {
                // Double check to match reasonably specific valid names if needed, 
                // but regex 'Vegetable Biryani' is quite specific already.
                item.image = imagePath;
                await item.save();
                console.log(`Updated image for "${item.name}" to "${imagePath}"`);
            }
        }

        console.log('Vegetable Biryani image updated successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

updateVegBiryani();
