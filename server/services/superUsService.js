const db = require("../models/db");
const logger = require("../utils/logger");
const { getIo } = require("../utils/socket");

const getPendingOrders = (callback) => {
  const query = `
    SELECT id_pedido, id_cliente, estado, fecha_compra
    FROM pedidos
    WHERE estado = 'pendiente';
  `;

  db.query(query, (err, result) => {
    if (err) {
      logger.error("Error al obtener pedidos pendientes:", err);
      return callback(err, null);
    }
    callback(null, result);
  });
};

const getOrdersByState = (estado, callback) => {
  let whereClause = "";
  let queryParams = [];

  if (estado) {
    const validStates = ["pendiente", "en proceso", "por entrega", "entregado"];
    if (!validStates.includes(estado)) {
      return callback(new Error("Estado no válido"), null);
    }
    whereClause = "WHERE p.estado = ?";
    queryParams = [estado];
  }

  const query = `
    SELECT 
      p.id_pedido, 
      p.id_cliente, 
      p.estado, 
      p.fecha_compra, 
      p.monto_total,
      c.nombre AS cliente_nombre,
      c.correo_electronico AS cliente_correo,
      c.telefono AS cliente_telefono
    FROM pedidos p
    JOIN clientes c ON p.id_cliente = c.id_cliente
    ${whereClause};
  `;

  db.query(query, queryParams, (err, result) => {
    if (err) {
      logger.error(
        `Error al obtener pedidos ${estado || "de todos los estados"}:`,
        err
      );
      return callback(err, null);
    }
    callback(null, result);
  });
};

const updateOrderStatus = (id_pedido, nuevoEstado, callback) => {
  const validStates = ['en proceso', 'por entrega', 'entregado'];

  // Validación del estado
  if (!validStates.includes(nuevoEstado)) {
    return callback(new Error('Estado no válido'), null);
  }

  // Consulta SQL para actualizar el estado del pedido
  const updateQuery = `
    UPDATE pedidos
    SET estado = ?
    WHERE id_pedido = ?;
  `;

  // Ejecutar la consulta
  db.query(updateQuery, [nuevoEstado, id_pedido], (err, result) => {
    if (err) {
      // Manejo de errores
      logger.error('Error al actualizar estado del pedido:', err);
      return callback(err, null);
    }

    // Consulta para obtener la información del pedido actualizado
    const getOrderQuery = `
      SELECT id_cliente, estado
      FROM pedidos
      WHERE id_pedido = ?;
    `;

    db.query(getOrderQuery, [id_pedido], (err, rows) => {
      if (err) {
        // Manejo de errores
        logger.error('Error al obtener la información del pedido:', err);
        return callback(err, null);
      }

      if (rows.length === 0) {
        return callback(new Error('Pedido no encontrado'), null);
      }

      const pedido = rows[0];
      const io = getIo();

      // Emitir notificación a la sala del cliente
      io.to(pedido.id_cliente).emit("notificacion", {
        mensaje: `El pedido ${id_pedido} está: ${pedido.estado}`
      });

      // Llamada al callback con el resultado de la consulta de actualización
      callback(null, result);
    });
  });
};

module.exports = {
  getPendingOrders,
  getOrdersByState,
  updateOrderStatus,
};
