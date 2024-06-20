const express = require('express');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.get('/', orderController.placeOrder);
router.get('/cliente/:id_cliente', orderController.getOrdersByClient);

module.exports = router;
