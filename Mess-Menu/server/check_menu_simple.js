const mongoose = require('mongoose');
const Menu = require('./models/Menu');
const dotenv = require('dotenv');

dotenv.config();

const checkMenuSimple = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/mess_menu_db');
        console.log('MongoDB Connected');

        // Find without populate
        const menu = await Menu.findOne({});
        console.log('Menu found (raw):', menu);

        if (menu) {
            console.log('Items count:', menu.items.length);
        }

        process.exit();
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

checkMenuSimple();
