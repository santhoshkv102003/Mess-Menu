const mongoose = require('mongoose');
const FoodItem = require('./models/FoodItem');
const dotenv = require('dotenv');

dotenv.config();

const fixRemaining = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        await mongoose.connect(MONGODB_URI);

        const updates = [
            { name: "Vada", image: "/images/vada.jpg" },
            { name: "Mixture", image: "/images/mixture.jpg" }
        ];

        for (const update of updates) {
            const res = await FoodItem.updateOne({ name: update.name }, { $set: { image: update.image } });
            console.log(`Updated ${update.name}: ${res.modifiedCount}`);
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

fixRemaining();
