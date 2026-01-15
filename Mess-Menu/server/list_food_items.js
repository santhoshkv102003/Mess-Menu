const mongoose = require('mongoose');
const FoodItem = require('./models/FoodItem');
const dotenv = require('dotenv');

dotenv.config();

const listItems = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/mess_menu_db');
        console.log('MongoDB Connected');

        const items = await FoodItem.find({});
        console.log('--- All Food Items ---');
        items.forEach(item => {
            console.log(item.name);
        });
        console.log('---------------------');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

listItems();
