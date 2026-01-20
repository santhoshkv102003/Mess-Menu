const mongoose = require('mongoose');
const FoodItem = require('./models/FoodItem');
const dotenv = require('dotenv');

dotenv.config();

const verifyDinnerSnackImages = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/mess_menu_db');
        console.log('MongoDB Connected');

        const keywords = [
            'Puff',
            'Chapati',
            'Parotta',
            'Idiyappam',
            'Lemon Sevai'
        ];

        console.log('--- Verification ---');
        for (const k of keywords) {
            const items = await FoodItem.find({ name: { $regex: k, $options: 'i' } });
            items.forEach(i => console.log(`${i.name}: ${i.image}`));
        }
        console.log('--------------------');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verifyDinnerSnackImages();
