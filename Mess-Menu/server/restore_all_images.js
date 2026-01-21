const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const FoodItem = require('./models/FoodItem'); // Adjust path as needed

dotenv.config();

const IMAGES_DIR = path.join(__dirname, '../client/public/images');
const PUBLIC_URL_PREFIX = '/images/';

const restoreImages = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mess_menu_db';
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB Connected');

        // 1. Get all images from the directory
        if (!fs.existsSync(IMAGES_DIR)) {
            console.error(`Images directory not found at: ${IMAGES_DIR}`);
            process.exit(1);
        }

        const imageFiles = fs.readdirSync(IMAGES_DIR).filter(file =>
            ['.jpg', '.jpeg', '.png', '.svg', '.webp'].includes(path.extname(file).toLowerCase())
        );
        console.log(`Found ${imageFiles.length} image files in ${IMAGES_DIR}`);

        // 2. Get all food items from DB
        const foodItems = await FoodItem.find({});
        console.log(`Found ${foodItems.length} food items in DB`);

        let updatedCount = 0;
        let notFoundCount = 0;

        for (const item of foodItems) {
            // Normalize item name for matching
            // "Idli with Sambar" -> "idli_sambar", "appam_coconut_milk" matches

            // Strategy: Create a few variations of the name to check against filenames
            // 1. Snake case: "idli_with_sambar" or "idli_sambar"

            const nameLower = item.name.toLowerCase();
            const keywords = nameLower.split(/[\s\(\)\/]+/).filter(k => k.length > 0 && k !== 'with' && k !== 'and');

            // Try to find a file that contains most keywords
            let bestMatch = null;
            let maxScore = 0;

            for (const file of imageFiles) {
                const fileLower = file.toLowerCase();
                let score = 0;
                let matchedAll = true;

                // Simple scoring: how many keywords exist in the filename
                for (const keyword of keywords) {
                    if (fileLower.includes(keyword)) {
                        score++;
                    }
                }

                // Penalize if filename has extra words? Maybe not needed for now.

                if (score > maxScore) {
                    maxScore = score;
                    bestMatch = file;
                }
            }

            // Heuristic: If we matched at least half the keywords or it's a very strong unique match
            // Specifically handling known patterns if needed.
            // Let's print matches to verify first or just go for it with a threshold.

            if (bestMatch && maxScore > 0) {
                // Check specific manual overrides or common patterns if automatic matching is weak
                // e.g. "Idli with Sambar" might match "idli_sambar.jpg" (score 2: idli, sambar)

                const newImagePath = PUBLIC_URL_PREFIX + bestMatch;

                if (item.image !== newImagePath) {
                    item.image = newImagePath;
                    await item.save();
                    console.log(`Updated: "${item.name}" -> ${newImagePath}`);
                    updatedCount++;
                } else {
                    // console.log(`Skipped (Already set): "${item.name}" -> ${newImagePath}`);
                }
            } else {
                console.log(`Warning: No image found for "${item.name}"`);
                notFoundCount++;
            }
        }

        console.log(`\nResults: ${updatedCount} items updated, ${notFoundCount} items with no image found.`);
        process.exit(0);

    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

restoreImages();
