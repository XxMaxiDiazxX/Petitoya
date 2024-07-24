const db = require('../models/db');
const logger = require('../utils/logger');

exports.getPendingOrders = (req, res) => {
  const query = `
    SELECT id_pedido, id_cliente, estado, fecha_compra
    FROM pedidos
    WHERE estado = 'pendiente';
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
exports.getOrdersByState = (req, res) => {
  let { estado } = req.params;

  // Si no se proporciona estado en la URL, asumir que se quieren todos los pedidos
  let whereClause = '';
  let queryParams = [];

  if (estado) {
    // Validar estado permitido
    const validStates = ['pendiente', 'en proceso', 'por entrega'];
    if (!validStates.includes(estado)) {
      return res.status(400).json({ error: 'Estado no válido' });
    }
    whereClause = 'WHERE estado = ?';
    queryParams = [estado];
  }

  const query = `
    SELECT id_pedido, id_cliente, estado, fecha_compra
    FROM pedidos
    ${whereClause};
  `;

  db.query(query, queryParams, (err, result) => {
    if (err) {
      logger.error(`Error al obtener pedidos ${estado || 'de todos los estados'}:`, err);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.status(200).json(result);
    }
  });
};

  // actualizar el estado del pedido, en proceso, por entrega, entregado
exports.updateOrderStatus = (req, res) => {
    const { id_pedido } = req.params;
    const { nuevoEstado } = req.body;
  
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