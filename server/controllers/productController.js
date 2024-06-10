const fs = require('fs');
const db = require('../models/db');
const logger = require('../utils/logger');

exports.getProducts = (req, res) => {
  db.query('SELECT * FROM productos', (err, result) => {
    if (err) {
      logger.error('Error al consultar la base de datos:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.status(200).json(result);
    }
  });
};

exports.getProductsByCategory = (req, res) => {
  const categoria = req.params.categoria;
  db.query('SELECT * FROM productos WHERE categoria = ?', [categoria], (err, result) => {
    if (err) {
      logger.error('Error al consultar la base de datos:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.status(200).json(result);
    }
  });
};

exports.createProduct = (req, res) => {
  const imagen = req.file;
  const { id_producto, nombre, descripcion, precio, categoria } = req.body;

  const imagenBinaria = fs.readFileSync(imagen.path);

  db.query(
    'CALL CrearProducto(?, ?, ?, ?, ?, ?)',
    [id_producto, nombre, descripcion, precio, categoria, imagenBinaria],
    (err, result) => {
      if (err) {
        logger.error('Error al insertar producto en la base de datos:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        res.status(200).json({ message: 'Producto creado exitosamente' });
      }
    }
  );
};

exports.updateProduct = (req, res) => {
  const id_producto = req.params.id_producto;
  const { nombre, descripcion, precio, categoria } = req.body;

  db.query(
    'CALL ModificarProducto(?, ?, ?, ?, ?)',
    [id_producto, nombre, descripcion, precio, categoria],
    (err, result) => {
      if (err) {
        logger.error('Error al actualizar el producto:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        res.status(200).json({ message: 'Producto actualizado exitosamente' });
      }
    }
  );
};

exports.deactivateProduct = (req, res) => {
  const id_producto = req.params.id_producto;

  db.query(
    'CALL DesactivarProducto(?)',
    [id_producto],
    (err, result) => {
      if (err) {
        logger.error('Error al desactivar el producto:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        res.status(200).json({ message: 'Producto desactivado exitosamente' });
      }
    }
  );
};

exports.activateProduct = (req, res) => {
  const id_producto = req.params.id_producto;

  db.query(
    'CALL HabilitarProducto(?)',
    [id_producto],
    (err, result) => {
      if (err) {
        logger.error('Error al habilitar el producto:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        res.status(200).json({ message: 'Producto habilitado exitosamente' });
      }
    }
  );
};
