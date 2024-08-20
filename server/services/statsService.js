// src/services/productService.js
const db = require('../models/db');
const logger = require('../utils/logger');

const productosMasComprados = (callback) => {
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
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

const productosMenosComprados = (callback) => {
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
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

const ventasDiarias = (callback) => {
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
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

const ventasSemanales = (callback) => {
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
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

const ventasMensuales = (callback) => {
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
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

module.exports = {
  productosMasComprados,
  productosMenosComprados,
  ventasDiarias,
  ventasSemanales,
  ventasMensuales,
};
