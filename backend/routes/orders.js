const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.get('/location/:locationId', orderController.getOrdersByLocation);
router.get('/date-range/:startDate/:endDate', orderController.getOrdersByDateRange);

module.exports = router;