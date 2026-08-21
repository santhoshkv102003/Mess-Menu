const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: '*', // Allow all origins for Vercel deployment (or restrict to your frontend domain)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.get('/', (req, res) => {
    res.send('Smart Mess Menu API is running');
});

app.get('/api/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState;
    const statusMap = {
        0: 'Disconnected',
        1: 'Connected',
        2: 'Connecting',
        3: 'Disconnecting',
    };
    res.json({
        status: 'ok',
        database: statusMap[dbStatus],
        dbName: mongoose.connection.name,
        env_check: process.env.MONGODB_URI ? 'URI Set' : 'URI Missing'
    });
});

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mess_menu_db';

const connectWithRetry = (retries = 5, delay = 5000) => {
    mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        family: 4, // Force IPv4 — avoids IPv6 DNS issues
    })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error(`MongoDB Connection Error (${retries} retries left):`, err.message);
        if (retries > 0) {
            console.log(`Retrying in ${delay / 1000}s...`);
            setTimeout(() => connectWithRetry(retries - 1, delay), delay);
        } else {
            console.error('All MongoDB connection attempts failed. Check Atlas IP whitelist and cluster status.');
        }
    });
};

connectWithRetry();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));

// Export module for Vercel
module.exports = app;

// Start Server only if running directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
