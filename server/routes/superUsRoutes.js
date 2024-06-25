const express = require('express');
const upload = require('../middlewares/uploadMiddleware');
const SUperUsController = require('../controllers/superUsController');

const router = express.Router();

router.get('/:estado', SUperUsController.getOrdersByState);
router.get('/pendientes', SUperUsController.getPendingOrders);
router.put('/:id_pedido', SUperUsController.updateOrderStatus);


module.exports = router;