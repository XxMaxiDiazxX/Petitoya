const express = require('express');
const cartController = require('../controllers/cartController');

const router = express.Router();

router.post('/', cartController.addToCart);
router.get('/:id_cliente', cartController.getCart);
router.put('/', cartController.updateCart);
router.delete('/:id_cliente/:id_producto', cartController.removeFromCart);
module.exports = router;
