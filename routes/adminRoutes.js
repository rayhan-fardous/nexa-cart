const express = require('express');
const router = express.Router();
const { addManager, getAllManagers, deleteManager, viewAllProducts } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Protect all routes below and authorize only for 'admin' role
router.use(protect, authorize('admin'));

router.post('/managers', addManager);
router.get('/managers', getAllManagers);
router.delete('/managers/:id', deleteManager);
router.get('/products', viewAllProducts);

module.exports = router;