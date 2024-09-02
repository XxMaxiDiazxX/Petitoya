const express = require('express');
const router = express.Router();

const adminController = require("../controllers/adminController")

router.get('/consultar_superus', adminController.obtenerSuperUsuarios);

module.exports = router;