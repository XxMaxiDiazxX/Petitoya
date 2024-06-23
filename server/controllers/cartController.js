const db = require('../models/db');
const logger = require('../utils/logger');

exports.addToCart = (req, res) => {
  const { id_cliente, id_producto, cantidad } = req.body;

  db.query(
    'SELECT * FROM carrito WHERE id_cliente = ? AND id_producto = ?',
    [id_cliente, id_producto],
    (err, result) => {
      if (err) {
        logger.error('Error al consultar la base de datos:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }

      if (result.length > 0) {
        db.query(
          'UPDATE carrito SET cantidad = cantidad + ? WHERE id_cliente = ? AND id_producto = ?',
          [cantidad, id_cliente, id_producto],
          (err) => {
            if (err) {
              logger.error('Error al actualizar el carrito:', err);
              return res.status(500).json({ error: 'Error interno del servidor' });
            }
            res.status(200).json({ message: 'Producto actualizado en el carrito' });
          }
        );
      } else {
        db.query(
          'INSERT INTO carrito (id_cliente, id_producto, cantidad) VALUES (?, ?, ?)',
          [id_cliente, id_producto, cantidad],
          (err) => {
            if (err) {
              logger.error('Error al añadir producto al carrito:', err);
              return res.status(500).json({ error: 'Error interno del servidor' });
            }
            res.status(200).json({ message: 'Producto añadido al carrito' });
          }
        );
      }
    }
  );
};

exports.getCart = (req, res) => {
  const id_cliente = req.params.id_cliente;

  db.query(
    'SELECT c.id_cliente, c.id_producto, p.nombre, p.descripcion, p.precio, c.cantidad ' +
    'FROM carrito c JOIN productos p ON c.id_producto = p.id_producto WHERE c.id_cliente = ?',
    [id_cliente],
    (err, result) => {
      if (err) {
        logger.error('Error al consultar el carrito:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
      res.status(200).json(result);
    }
  );
};

// Actualizar la cantidad de un producto en el carrito
exports.updateCart = (req, res) => {
  const { id_cliente, id_producto, cantidad } = req.body;

  db.query(
    'UPDATE carrito SET cantidad = ? WHERE id_cliente = ? AND id_producto = ?',
    [cantidad, id_cliente, id_producto],
    (err) => {
      if (err) {
        logger.error('Error al actualizar el carrito:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
      res.status(200).json({ message: 'Cantidad actualizada en el carrito' });
    }
  );
};

// Eliminar un producto del carrito
exports.removeFromCart = (req, res) => {
  const { id_cliente, id_producto } = req.params; // Cambiado a req.params para obtener de la URL

  db.query(
    'DELETE FROM carrito WHERE id_cliente = ? AND id_producto = ?',
    [id_cliente, id_producto],
    (err) => {
      if (err) {
        logger.error('Error al eliminar producto del carrito:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
      res.status(200).json({ message: 'Producto eliminado del carrito' });
    }
  );
};
