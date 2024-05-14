const express = require('express');
const productController = require('../controllers/productController');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.get('/', productController.getProducts);
router.get('/:categoria', productController.getProductsByCategory);
router.post('/', upload.single('imagen'), productController.createProduct);
router.put('/:id_producto', productController.updateProduct);
router.put('/desactivar/:id_producto', productController.deactivateProduct);

module.exports = router;
