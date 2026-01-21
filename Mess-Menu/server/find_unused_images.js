const mongoose = require('mongoose');
const FoodItem = require('./models/FoodItem');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const IMAGES_DIR = path.join(__dirname, '../client/public/images');

const findUnused = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/mess_menu_db');

        // Get all DB images
        const foodItems = await FoodItem.find({});
        const dbImages = new Set(foodItems.map(i => i.image.replace('/images/', '')));

        // Get all files
        const files = fs.readdirSync(IMAGES_DIR).filter(file =>
            ['.jpg', '.jpeg', '.png', '.svg', '.webp'].includes(path.extname(file).toLowerCase())
        );

        const unusedFiles = files.filter(f => !dbImages.has(f));

        console.log(`Total Files: ${files.length}`);
        console.log(`Total DB Items: ${foodItems.length}`);
        console.log(`Unused Files (${unusedFiles.length}):`);
        unusedFiles.forEach(f => console.log(`- ${f}`));

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

findUnused();
