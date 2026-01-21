const mongoose = require('mongoose');
const Menu = require('./models/Menu');
const FoodItem = require('./models/FoodItem');
const dotenv = require('dotenv');

dotenv.config();

const checkMenuPresence = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/mess_menu_db');
        const month = new Date().toISOString().slice(0, 7);
        const menu = await Menu.findOne({ month }).populate('items');

        const targets = ["Upma", "Vegetable Biryani", "Vegetable Fried Rice"];
        const found = [];
        const missing = [];

        if (menu && menu.items) {
            targets.forEach(t => {
                if (menu.items.find(i => i.name === t)) {
                    found.push(t);
                } else {
                    missing.push(t);
                }
            });
        }

        console.log(`Found in Menu: ${found.join(', ')}`);
        console.log(`Missing from Menu: ${missing.join(', ')}`);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkMenuPresence();
