const mongoose = require('mongoose');
const Menu = require('./models/Menu');
const dotenv = require('dotenv');

dotenv.config();

const checkMenu = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/mess_menu_db');
        console.log('MongoDB Connected');

        const month = new Date().toISOString().slice(0, 7); // YYYY-MM
        console.log(`Checking menu for month: ${month}`);

        const menu = await Menu.findOne({ month }).populate('items');

        if (menu) {
            console.log('Found active menu!');
            console.log(`Menu ID: ${menu._id}`);
            console.log(`Items count: ${menu.items.length}`);
            console.log('--- Sample Items ---');
            menu.items.slice(0, 5).forEach(i => console.log(i.name));
        } else {
            console.log('No active menu found for this month.');
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkMenu();
