const mongoose = require('mongoose');
const FoodItem = require('./models/FoodItem');
const dotenv = require('dotenv');

dotenv.config();

const verifyImages = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/mess_menu_db');

        const keywords = ['Appam', 'Puttu', 'Uttapam', 'Omelette', 'Idli'];

        for (const keyword of keywords) {
            const items = await FoodItem.find({ name: { $regex: keyword, $options: 'i' } });
            console.log(`--- Items matching "${keyword}" ---`);
            items.forEach(item => {
                console.log(`${item.name}: ${item.image}`);
            });
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verifyImages();
