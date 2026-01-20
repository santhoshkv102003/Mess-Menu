const express = require('express');
const router = express.Router();
const { addFoodItem, deleteFoodItem, getFoodItems, lockMenu, getVotes, generateMonthlyMenu, generateWeeklyReplacement, getFoodAnalytics } = require('../controllers/adminController');
const auth = require('../middleware/authMiddleware');

// Middleware to check if user is admin
const adminAuth = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
};

router.post('/food-item', auth, adminAuth, addFoodItem);
router.delete('/food-item/:id', auth, adminAuth, deleteFoodItem);
router.get('/food-items', auth, getFoodItems);
router.post('/menu', auth, adminAuth, lockMenu);
router.get('/votes', auth, adminAuth, getVotes);
router.get('/generate-monthly', auth, adminAuth, generateMonthlyMenu);
router.get('/generate-weekly', auth, adminAuth, generateWeeklyReplacement);
router.get('/analytics', auth, adminAuth, getFoodAnalytics);

module.exports = router;
