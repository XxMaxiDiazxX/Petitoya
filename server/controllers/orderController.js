const db = require('../models/db');
const logger = require('../utils/logger');

// Ver el historial de pedidos por cliente
exports.getOrdersByClient = (req, res) => {
  const id_cliente = req.params.id_cliente;

  db.query('SELECT * FROM pedidos WHERE id_cliente = ?', [id_cliente], (err, result) => {
    if (err) {
      logger.error('Error al consultar la base de datos:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.status(200).json(result);
    }
  });
};

// Realizar pedido desde el carrito
exports.placeOrder = (req, res) => {
  const { id_cliente } = req.body;

  // Obtener el contenido del carrito
  db.query('SELECT * FROM carrito WHERE id_cliente = ?', [id_cliente], (err, cartItems) => {
    if (err) {
      logger.error('Error al consultar el carrito:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    // Crear el pedido
    db.query('INSERT INTO pedidos (id_cliente, estado) VALUES (?, ?)', [id_cliente, 'pendiente'], (err, result) => {
      if (err) {
        logger.error('Error al crear el pedido:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }

      const id_pedido = result.insertId;

      // Insertar cada producto del carrito en pedido_producto
      const values = cartItems.map(item => [id_pedido, item.id_producto, item.cantidad, item.cantidad * item.precio]);
      db.query('INSERT INTO pedido_producto (id_pedido, id_producto, cantidad, precio_compra) VALUES ?', [values], (err) => {
        if (err) {
          logger.error('Error al insertar productos del carrito en el pedido:', err);
          return res.status(500).json({ error: 'Error interno del servidor' });
        }

        // Vaciar el carrito
        db.query('DELETE FROM carrito WHERE id_cliente = ?', [id_cliente], (err) => {
          if (err) {
            logger.error('Error al vaciar el carrito:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
          }

          res.status(200).json({ message: 'Pedido realizado con éxito', id_pedido });
        });
      });
    });
  });
};

