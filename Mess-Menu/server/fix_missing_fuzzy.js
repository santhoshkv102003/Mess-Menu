const mongoose = require('mongoose');
const FoodItem = require('./models/FoodItem');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const IMAGES_DIR = path.join(__dirname, '../client/public/images');
const PUBLIC_URL_PREFIX = '/images/';

const fixMissingFuzzy = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        await mongoose.connect(MONGODB_URI);

        const items = await FoodItem.find({});
        const missing = items.filter(i => !i.image || i.image.trim() === '');

        console.log(`Analyzing ${missing.length} missing items...`);

        const files = fs.readdirSync(IMAGES_DIR);

        for (const item of missing) {
            const nameTokens = item.name.toLowerCase().replace(/[\(\)\/]/g, '').split(' ').filter(t => t.length > 2);

            let bestMatch = null;
            let maxScore = 0;

            for (const file of files) {
                const fileLower = file.toLowerCase();
                let score = 0;
                nameTokens.forEach(token => {
                    if (fileLower.includes(token)) score++;
                });

                if (score > maxScore) {
                    maxScore = score;
                    bestMatch = file;
                }
            }

            if (bestMatch && maxScore >= 2) { // Require at least 2 token matches
                const newPath = PUBLIC_URL_PREFIX + bestMatch;
                console.log(`Match: "${item.name}" -> ${bestMatch} (Score: ${maxScore})`);
                item.image = newPath;
                await item.save();
            } else {
                console.log(`No good match for "${item.name}" (Max Score: ${maxScore})`);
            }
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

fixMissingFuzzy();
