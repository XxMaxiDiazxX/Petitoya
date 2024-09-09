const express = require('express');
const productController = require('../controllers/productController');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();


router.get('/obtenercarru',upload.single('imagen'), productController.listCarouselItems);
router.get('/leastused', productController.getLeastUsedProducts);
router.get('/', productController.getProducts);
router.get('/:categoria', productController.getProductsByCategory);
router.post( '/',upload.single('imagen'), productController.createProduct);
router.put('/:id_producto', upload.single('imagen') , productController.updateProduct);
router.put('/desactivar/:id_producto', productController.deactivateProduct);
router.put('/habilitar/:id_producto', productController.activateProduct);

// Ruta para agregar un nuevo item al carrusel
router.post('/anadircarru',upload.single('imagen'), productController.createCarouselItem);


module.exports = router;
