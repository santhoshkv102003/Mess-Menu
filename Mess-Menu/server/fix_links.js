const mongoose = require('mongoose');
const FoodItem = require('./models/FoodItem');
const dotenv = require('dotenv');

dotenv.config();

const fixLinks = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mess_menu_db';
        await mongoose.connect(MONGODB_URI);

        const updates = [
            { name: "Upma", image: "/images/upma.jpg" },
            { name: "Vegetable Biryani", image: "/images/veg_biryani.jpg" },
            { name: "Vegetable Fried Rice", image: "/images/veg_fried_rice.jpg" }
        ];

        for (const update of updates) {
            const res = await FoodItem.updateOne({ name: update.name }, { $set: { image: update.image } });
            if (res.modifiedCount > 0) {
                console.log(`Updated ${update.name} to ${update.image}`);
            } else {
                console.log(`No change for ${update.name}`);
            }
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

fixLinks();
