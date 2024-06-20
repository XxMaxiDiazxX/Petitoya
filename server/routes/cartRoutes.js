const express = require('express');
const cartcontroller = require('../controllers/cartController');

const router = express.Router();

router.get('/', cartcontroller.addToCart);
router.get('/:id_cliente', cartcontroller.getCart);

module.exports = router;
