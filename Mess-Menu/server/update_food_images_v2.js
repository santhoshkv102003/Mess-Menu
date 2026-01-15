const mongoose = require('mongoose');
const FoodItem = require('./models/FoodItem');
const dotenv = require('dotenv');

dotenv.config();

const updateImagesV2 = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/mess_menu_db');
        console.log('MongoDB Connected');

        const updates = [
            { keyword: 'Pongal', image: '/images/pongal.jpg' },
            { keyword: 'Idly', image: '/images/idly_sambar_v2.jpg' },
            { keyword: 'Poori', image: '/images/poori_masala.jpg' },
            { keyword: 'Upma', image: '/images/upma.jpg' },
            { keyword: 'Rava', image: '/images/rava_dosa.jpg' }
        ];

        for (const update of updates) {
            // Find items containing the keyword (case-insensitive)
            const items = await FoodItem.find({ name: { $regex: update.keyword, $options: 'i' } });

            if (items.length === 0) {
                console.log(`No items found for keyword "${update.keyword}"`);
            } else {
                for (const item of items) {
                    // Avoid updating if it's "Rava Upma" and we are looking for "Rava" but also "Upma"...
                    // Logic: 
                    // 'Upma' -> matches 'Upma', 'Semiya Upma', 'Rava Upma'
                    // 'Rava' -> matches 'Rava Dosa', 'Rava Upma'
                    // To be safe, let's just apply updates. If "Rava Upma" gets "Rava Dosa" image, that's a risk.
                    // User said "rava dosa".
                    // Let's refine strictness if needed.
                    // If keyword is 'Rava', let's make sure it includes 'Dosa' if possible, or just trust the 'Rava' keyword for now as per plan.

                    // Actually, refined check for Rava Dosa specifically:
                    if (update.keyword === 'Rava' && !item.name.toLowerCase().includes('dosa')) {
                        console.log(`Skipping "${item.name}" for Rava Dosa update (does not contain 'dosa')`);
                        continue;
                    }

                    item.image = update.image;
                    await item.save();
                    console.log(`Updated image for "${item.name}" to "${update.image}"`);
                }
            }
        }

        console.log('Images V2 updated successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

updateImagesV2();
