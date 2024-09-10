const express = require('express');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.post('/', orderController.placeOrder);
router.post('/pedido', orderController.placeOrderuno);
router.get('/detalles/:id_pedido', orderController.getOrderDetails);
router.get('/cliente/:id_cliente', orderController.getOrdersByClient);


module.exports = router;
