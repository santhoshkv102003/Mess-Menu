const mongoose = require('mongoose');
const FoodItem = require('./models/FoodItem');
const dotenv = require('dotenv');

dotenv.config();

const findItems = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/mess_menu_db');
        console.log('MongoDB Connected');

        const searchTerms = [
            'Fried Rice',
            'Parotta',
            'Noodles',
            'Chapati'
        ];

        const items = await FoodItem.find({
            name: {
                $in: [
                    /Fried Rice/i,
                    /Parotta/i,
                    /Noodles/i,
                    /Chapati/i
                ]
            }
        }); // simple find won't work with regex in $in like that usually, better to use $or with $regex

        const regexQueries = searchTerms.map(term => ({ name: { $regex: term, $options: 'i' } }));

        const foundItems = await FoodItem.find({ $or: regexQueries });

        console.log('--- Found Items ---');
        foundItems.forEach(item => {
            console.log(`Name: "${item.name}", Image: "${item.image}"`);
        });
        console.log('-------------------');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

findItems();
