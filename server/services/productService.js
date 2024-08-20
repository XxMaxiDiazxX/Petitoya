// src/services/productService.js
const db = require('../models/db');
const logger = require('../utils/logger');
const path = require('path');
const fs = require('fs');

const getProducts = (callback) => {
  db.query('SELECT * FROM productos', (err, result) => {
    if (err) {
      logger.error('Error al consultar la base de datos:', err);
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

const getProductsByCategory = (categoria, callback) => {
  db.query('SELECT * FROM productos WHERE categoria = ?', [categoria], (err, result) => {
    if (err) {
      logger.error('Error al consultar la base de datos:', err);
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

const getInactiveProducts = (callback) => {
  db.query('SELECT * FROM productos WHERE estado = "inactivo"', (err, result) => {
    if (err) {
      logger.error('Error al consultar la base de datos:', err);
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

const createProduct = (productData, callback) => {
  const { id_producto, nombre, descripcion, precio, categoria, imagenRuta } = productData;

  db.query(
    'CALL CrearProducto(?, ?, ?, ?, ?, ?)',
    [id_producto, nombre, descripcion, precio, categoria, imagenRuta],
    (err, result) => {
      if (err) {
        logger.error('Error al insertar producto en la base de datos:', err);
        callback(err, null);
      } else {
        callback(null, result);
      }
    }
  );
};

const updateProduct = (productData, callback) => {
  const { id_producto, nombre, descripcion, precio, categoria, imagen } = productData;

  db.query('SELECT imagen FROM productos WHERE id_producto = ?', [id_producto], (err, result) => {
    if (err) {
      logger.error('Error al obtener la imagen anterior:', err);
      callback(err, null);
    } else {
      const oldImage = result[0]?.imagen;
      if (oldImage && imagen) {
        const oldImagePath = path.join(path.join(__dirname, '../uploads'), path.basename(oldImage));
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            logger.error('Error al eliminar la imagen anterior:', err);
          }
        });
      }

      db.query(
        'CALL ModificarProducto(?, ?, ?, ?, ?, ?)',
        [id_producto, nombre, descripcion, precio, categoria, imagen],
        (err, result) => {
          if (err) {
            logger.error('Error al actualizar el producto:', err);
            callback(err, null);
          } else {
            callback(null, result);
          }
        }
      );
    }
  });
};

const deactivateProduct = (id_producto, callback) => {
  db.query(
    'CALL DesactivarProducto(?)',
    [id_producto],
    (err, result) => {
      if (err) {
        logger.error('Error al desactivar el producto:', err);
        callback(err, null);
      } else {
        callback(null, result);
      }
    }
  );
};

const activateProduct = (id_producto, callback) => {
  db.query(
    'CALL HabilitarProducto(?)',
    [id_producto],
    (err, result) => {
      if (err) {
        logger.error('Error al habilitar el producto:', err);
        callback(err, null);
      } else {
        callback(null, result);
      }
    }
  );
};

const getLeastUsedProducts = (callback) => {
  const query = `
    SELECT 
        sub.id_producto,
        sub.nombre,
        sub.descripcion,
        sub.precio,
        sub.categoria,
        sub.cantidad_pedidos,
        sub.imagen
    FROM (
        (SELECT 
            p.id_producto,
            p.nombre,
            p.descripcion,
            p.precio,
            p.categoria,
            p.imagen,
            COUNT(pp.id_pedido) AS cantidad_pedidos
        FROM 
            productos p
        LEFT JOIN 
            pedido_producto pp ON p.id_producto = pp.id_producto
        WHERE 
            p.categoria = 'Comida' AND p.estado = 'activo'
        GROUP BY 
            p.id_producto, p.nombre, p.descripcion, p.precio, p.categoria, p.imagen
        ORDER BY 
            cantidad_pedidos ASC
        LIMIT 4)
        
        UNION ALL
        
        (SELECT 
            p.id_producto,
            p.nombre,
            p.descripcion,
            p.precio,
            p.categoria,
            p.imagen,
            COUNT(pp.id_pedido) AS cantidad_pedidos
        FROM 
            productos p
        LEFT JOIN 
            pedido_producto pp ON p.id_producto = pp.id_producto
        WHERE 
            p.categoria = 'Bebida' AND p.estado = 'activo'
        GROUP BY 
            p.id_producto, p.nombre, p.descripcion, p.precio, p.categoria, p.imagen
        ORDER BY 
            cantidad_pedidos ASC
        LIMIT 4)
    ) AS sub
    ORDER BY sub.cantidad_pedidos ASC;
  `;

  db.query(query, (err, result) => {
    if (err) {
      logger.error('Error al consultar la base de datos:', err);
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

module.exports = {
  getProducts,
  getProductsByCategory,
  getInactiveProducts,
  createProduct,
  updateProduct,
  deactivateProduct,
  activateProduct,
  getLeastUsedProducts,
};
