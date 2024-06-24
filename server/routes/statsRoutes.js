const express = require('express');
const statsController = require("../controllers/statsController")
const router = express.Router()


router.get('/mascomprados', statsController.productosMasComprados)
router.get('/menoscomprados', statsController.productosMenosComprados)
router.get('/diarias', statsController.ventasDiarias)
router.get('/semanales', statsController.ventasSemanales)
router.get('/mensuales', statsController.ventasMensuales)

module.exports = router;
