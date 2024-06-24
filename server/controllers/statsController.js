const db = require('../models/db');
const logger = require('../utils/logger');


exports.productosMasComprados = () => {
    const query = `
    SELECT p.id_producto, p.nombre, SUM(pp.cantidad) AS total_cantidad
    FROM productos p
    JOIN pedido_producto pp ON p.id_producto = pp.id_producto
    GROUP BY p.id_producto, p.nombre
    ORDER BY total_cantidad DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      logger.error('Error al consultar la base de datos:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.status(200).json(results);
    }
  });

};