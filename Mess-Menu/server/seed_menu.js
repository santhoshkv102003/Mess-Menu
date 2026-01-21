const mongoose = require('mongoose');
const Menu = require('./models/Menu');
const FoodItem = require('./models/FoodItem');
const dotenv = require('dotenv');

dotenv.config();

const seedMenu = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mess_menu_db';
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB Connected');

        const month = new Date().toISOString().slice(0, 7); // YYYY-MM

        // 1. Clear existing menu for this month
        await Menu.deleteMany({ month });
        console.log(`Cleared existing menus for ${month}`);

        // 2. Fetch all items
        const allItems = await FoodItem.find({});

        const categories = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];
        const selectedItems = [];

        // 3. Select 7 items per category
        for (const cat of categories) {
            const catItems = allItems.filter(i => i.category === cat);
            if (catItems.length < 7) {
                console.warn(`Warning: Not enough items for ${cat} (Found ${catItems.length}, need 7)`);
                // Take what we have, or duplicate? Let's take what we have + wrap around if needed
                // But simplified: just take what we have
                selectedItems.push(...catItems.map(i => i._id));
            } else {
                // Shuffle and take 7
                const shuffled = catItems.sort(() => 0.5 - Math.random());
                selectedItems.push(...shuffled.slice(0, 7).map(i => i._id));
            }
        }

        console.log(`Selected ${selectedItems.length} items for the menu.`);

        // 4. Create Menu
        const newMenu = new Menu({
            month,
            week: 1,
            items: selectedItems,
            isLocked: true
        });

        await newMenu.save();
        console.log('Menu created successfully!');

        process.exit(0);
    } catch (err) {
        console.error('Error seeding menu:', err);
        process.exit(1);
    }
};

seedMenu();
