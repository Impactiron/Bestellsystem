const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// POST - Create new order
router.post('/', orderController.createOrder);

// GET - Get all orders
router.get('/', orderController.getAllOrders);

// GET - Get order by ID
router.get('/:id', orderController.getOrderById);

// GET - Get orders by location
router.get('/location/:locationId', orderController.getOrdersByLocation);

// GET - Get orders by date range
router.get('/date-range/:startDate/:endDate', orderController.getOrdersByDateRange);

module.exports = router;
