const express = require('express');
const router = express.Router();

const adminController = require("../controllers/adminController")

router.get('/consultar_superus', adminController.obtenerSuperUsuarios);
router.delete('/eliminar_superus/:id', adminController.deleteSuperUsuarioById);

module.exports = router;