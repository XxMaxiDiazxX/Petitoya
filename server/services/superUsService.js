const db = require('../models/db');
const logger = require('../utils/logger');

const getPendingOrders = (callback) => {
  const query = `
    SELECT id_pedido, id_cliente, estado, fecha_compra
    FROM pedidos
    WHERE estado = 'pendiente';
  `;

  db.query(query, (err, result) => {
    if (err) {
      logger.error('Error al obtener pedidos pendientes:', err);
      return callback(err, null);
    }
    callback(null, result);
  });
};

const getOrdersByState = (estado, callback) => {
  let whereClause = '';
  let queryParams = [];

  if (estado) {
    const validStates = ['pendiente', 'en proceso', 'por entrega'];
    if (!validStates.includes(estado)) {
      return callback(new Error('Estado no válido'), null);
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
      return callback(err, null);
    }
    callback(null, result);
  });
};

const updateOrderStatus = (id_pedido, nuevoEstado, callback) => {
  const validStates = ['en proceso', 'por entrega', 'entregado'];
  if (!validStates.includes(nuevoEstado)) {
    return callback(new Error('Estado no válido'), null);
  }

  const updateQuery = `
    UPDATE pedidos
    SET estado = ?
    WHERE id_pedido = ?;
  `;

  db.query(updateQuery, [nuevoEstado, id_pedido], (err, result) => {
    if (err) {
      logger.error('Error al actualizar estado del pedido:', err);
      return callback(err, null);
    }
    callback(null, result);
  });
};

module.exports = {
  getPendingOrders,
  getOrdersByState,
  updateOrderStatus
};
