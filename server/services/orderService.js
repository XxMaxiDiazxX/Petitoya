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

// Realizar un pedido de un producto específico
const placeOrderuno = (id_cliente, id_producto, cantidad) => {
  return new Promise((resolve, reject) => {
    // Comienza una transacción
    db.beginTransaction((err) => {
      if (err) {
        logger.error(`Error al iniciar la transacción: ${err.message}`);
        return reject(err);
      }

      // Inserta el nuevo pedido en la tabla 'pedidos'
      const insertOrderQuery = `
        INSERT INTO pedidos (id_cliente, fecha_compra, estado) 
        VALUES (?, NOW(), 'pendiente')
      `;

      db.query(insertOrderQuery, [id_cliente], (error, results) => {
        if (error) {
          return db.rollback(() => {
            logger.error(`Error al insertar el pedido: ${error.message}`);
            reject(error);
          });
        }

        const id_pedido = results.insertId;

        // Inserta los detalles del pedido en la tabla 'pedido_producto'
        const insertOrderDetailsQuery = `
          INSERT INTO pedido_producto (id_pedido, id_producto, cantidad, precio_compra)
          SELECT ?, ?, ?, p.precio
          FROM productos p
          WHERE p.id_producto = ?
        `;

        db.query(insertOrderDetailsQuery, [id_pedido, id_producto, cantidad, id_producto], (error) => {
          if (error) {
            return db.rollback(() => {
              logger.error(`Error al insertar los detalles del pedido: ${error.message}`);
              reject(error);
            });
          }

          // Calcula el monto total del pedido
          const calculateTotalQuery = `
            SELECT SUM(cantidad * precio_compra) AS monto_total
            FROM pedido_producto
            WHERE id_pedido = ?
          `;

          db.query(calculateTotalQuery, [id_pedido], (error, results) => {
            if (error) {
              return db.rollback(() => {
                logger.error(`Error al calcular el monto total: ${error.message}`);
                reject(error);
              });
            }

            const monto_total = results[0].monto_total;

            // Actualiza el pedido con el monto total
            const updateOrderQuery = `
              UPDATE pedidos
              SET monto_total = ?
              WHERE id_pedido = ?
            `;

            db.query(updateOrderQuery, [monto_total, id_pedido], (error) => {
              if (error) {
                return db.rollback(() => {
                  logger.error(`Error al actualizar el monto total del pedido: ${error.message}`);
                  reject(error);
                });
              }

              // Commit de la transacción
              db.commit((err) => {
                if (err) {
                  return db.rollback(() => {
                    logger.error(`Error al hacer commit: ${err.message}`);
                    reject(err);
                  });
                }

                resolve({ id_pedido, message: 'Pedido realizado con éxito' });
              });
            });
          });
        });
      });
    });
  });
};


module.exports = {
  getOrdersByClient,
  getOrderDetails,
  placeOrder,
  placeOrderuno
};
