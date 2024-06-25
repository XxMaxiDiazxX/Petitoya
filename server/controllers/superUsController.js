const db = require('../models/db');
const logger = require('../utils/logger');

exports.getPendingOrders = (req, res) => {
  const query = `
    SELECT id_pedido, id_cliente, estado, fecha_compra
    FROM pedidos
    WHERE estado = 'pendientes';
  `;

  db.query(query, (err, result) => {
    if (err) {
      logger.error('Error al obtener pedidos pendientes:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.status(200).json(result);
    }
  });
};

// Obtener pedidos según estado
exports.getOrdersByState = (req, res) => {
  const { estado } = req.params;

  // Validar estado permitido
  const validStates = ['pendientes', 'en_proceso', 'por_entrega'];
  if (!validStates.includes(estado)) {
    return res.status(400).json({ error: 'Estado no válido' });
  }

  const query = `
    SELECT id_pedido, id_cliente, estado, fecha_compra
    FROM pedidos
    WHERE estado = ?;
  `;

  db.query(query, [estado], (err, result) => {
    if (err) {
      logger.error(`Error al obtener pedidos ${estado}:`, err);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.status(200).json(result);
    }
  });
};

// Actualizar estado de un pedido
exports.updateOrderStatus = (req, res) => {
  const { id_pedido } = req.params;
  const { nuevoEstado } = req.body;

  // Validar estado permitido
  const validStates = ['en proceso', 'por entrega', 'entregado'];
  if (!validStates.includes(nuevoEstado)) {
    return res.status(400).json({ error: 'Estado no válido' });
  }

  const updateQuery = `
    UPDATE pedidos
    SET estado = ?
    WHERE id_pedido = ?;
  `;

  db.query(updateQuery, [nuevoEstado, id_pedido], (err, result) => {
    if (err) {
      logger.error('Error al actualizar estado del pedido:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.status(200).json({ message: 'Estado actualizado correctamente' });
    }
  });
};
