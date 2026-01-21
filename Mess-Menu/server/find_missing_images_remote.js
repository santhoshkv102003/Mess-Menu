const mongoose = require('mongoose');
const FoodItem = require('./models/FoodItem');
const dotenv = require('dotenv');

dotenv.config();

const findMissing = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        await mongoose.connect(MONGODB_URI);
        console.log(`Connected to Remote DB`);

        const items = await FoodItem.find({});
        const missing = items.filter(i => !i.image || i.image.trim() === '');

        console.log(`Total Items: ${items.length}`);
        console.log(`Missing Images: ${missing.length}`);

        if (missing.length > 0) {
            console.log('--- Items with no images ---');
            missing.forEach(i => console.log(`- ${i.name}`));
        } else {
            console.log('All items have images!');
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

findMissing();
