const db = require('../models/db');
const logger = require('../utils/logger');

// Obtener el historial de pedidos por cliente
const getOrdersByClient = (id_cliente) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM pedidos WHERE id_cliente = ?', [id_cliente], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Obtener detalles del pedido por ID
const getOrderDetails = (id_pedido) => {
  const query = `
    SELECT p.id_producto, p.nombre, p.descripcion, p.precio, pp.cantidad, pp.precio_compra
    FROM pedido_producto pp
    JOIN productos p ON pp.id_producto = p.id_producto
    WHERE pp.id_pedido = ?
  `;
  
  return new Promise((resolve, reject) => {
    db.query(query, [id_pedido], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// Realizar un pedido desde el carrito
const placeOrder = (id_cliente) => {
  return new Promise((resolve, reject) => {
    const realizarPedidoQuery = `CALL RealizarPedidoDesdeCarrito(?, @p_id_pedido, @p_message)`;

    db.query(realizarPedidoQuery, [id_cliente], (error) => {
      if (error) return reject(error);

      const obtenerResultadoQuery = `SELECT @p_id_pedido AS id_pedido, @p_message AS message`;

      db.query(obtenerResultadoQuery, (error, results) => {
        if (error) return reject(error);

        const { id_pedido, message } = results[0];
        if (id_pedido) {
          resolve({ id_pedido, message });
        } else {
          reject({ message });
        }
      });
    });
  });
};

module.exports = {
  getOrdersByClient,
  getOrderDetails,
  placeOrder
};
