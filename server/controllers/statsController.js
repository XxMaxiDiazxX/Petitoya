const db = require('../models/db');
const logger = require('../utils/logger');

// Productos más comprados
exports.productosMasComprados = (req, res) => {
  const query = `
    SELECT p.id_producto, p.nombre, SUM(pp.cantidad) AS total_cantidad
    FROM productos p
    JOIN pedido_producto pp ON p.id_producto = pp.id_producto
    GROUP BY p.id_producto, p.nombre
    ORDER BY total_cantidad DESC
    LIMIT 10
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

// Productos menos comprados
exports.productosMenosComprados = (req, res) => {
  const query = `
    SELECT p.id_producto, p.nombre, SUM(pp.cantidad) AS total_cantidad
    FROM productos p
    JOIN pedido_producto pp ON p.id_producto = pp.id_producto
    GROUP BY p.id_producto, p.nombre
    ORDER BY total_cantidad ASC
    LIMIT 10
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

// Ventas diarias
exports.ventasDiarias = (req, res) => {
  const query = `
    SELECT DATE(p.fecha_compra) AS fecha, SUM(pp.cantidad * pp.precio_compra) AS total_ventas
    FROM pedidos p
    JOIN pedido_producto pp ON p.id_pedido = pp.id_pedido
    WHERE DATE(p.fecha_compra) = CURDATE()
    GROUP BY DATE(p.fecha_compra)
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

// Ventas semanales
exports.ventasSemanales = (req, res) => {
  const query = `
    SELECT YEARWEEK(p.fecha_compra, 1) AS semana, SUM(pp.cantidad * pp.precio_compra) AS total_ventas
    FROM pedidos p
    JOIN pedido_producto pp ON p.id_pedido = pp.id_pedido
    WHERE YEARWEEK(p.fecha_compra, 1) = YEARWEEK(CURDATE(), 1)
    GROUP BY YEARWEEK(p.fecha_compra, 1)
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

// Ventas mensuales
exports.ventasMensuales = (req, res) => {
  const query = `
    SELECT MONTH(p.fecha_compra) AS mes, SUM(pp.cantidad * pp.precio_compra) AS total_ventas
    FROM pedidos p
    JOIN pedido_producto pp ON p.id_pedido = pp.id_pedido
    WHERE MONTH(p.fecha_compra) = MONTH(CURDATE()) AND YEAR(p.fecha_compra) = YEAR(CURDATE())
    GROUP BY MONTH(p.fecha_compra)
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
