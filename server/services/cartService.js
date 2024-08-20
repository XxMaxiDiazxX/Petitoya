const db = require('../models/db');
const logger = require('../utils/logger');

// Añadir o actualizar producto en el carrito
const addToCart = (id_cliente, id_producto, cantidad) => {
  return new Promise((resolve, reject) => {
    db.query(
      'SELECT * FROM carrito WHERE id_cliente = ? AND id_producto = ?',
      [id_cliente, id_producto],
      (err, result) => {
        if (err) return reject(err);

        if (result.length > 0) {
          db.query(
            'UPDATE carrito SET cantidad = cantidad + ? WHERE id_cliente = ? AND id_producto = ?',
            [cantidad, id_cliente, id_producto],
            (err) => {
              if (err) return reject(err);
              resolve({ message: 'Producto actualizado en el carrito' });
            }
          );
        } else {
          db.query(
            'INSERT INTO carrito (id_cliente, id_producto, cantidad) VALUES (?, ?, ?)',
            [id_cliente, id_producto, cantidad],
            (err) => {
              if (err) return reject(err);
              resolve({ message: 'Producto añadido al carrito' });
            }
          );
        }
      }
    );
  });
};

// Obtener el carrito de un cliente
const getCart = (id_cliente) => {
  return new Promise((resolve, reject) => {
    db.query(
      'SELECT c.id_cliente, c.id_producto, p.nombre, p.descripcion, p.precio, c.cantidad, p.imagen ' +
      'FROM carrito c JOIN productos p ON c.id_producto = p.id_producto WHERE c.id_cliente = ?',
      [id_cliente],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

// Actualizar la cantidad de un producto en el carrito
const updateCart = (id_cliente, id_producto, cantidad) => {
  return new Promise((resolve, reject) => {
    db.query(
      'UPDATE carrito SET cantidad = ? WHERE id_cliente = ? AND id_producto = ?',
      [cantidad, id_cliente, id_producto],
      (err) => {
        if (err) return reject(err);
        resolve({ message: 'Cantidad actualizada en el carrito' });
      }
    );
  });
};

// Eliminar un producto del carrito
const removeFromCart = (id_cliente, id_producto) => {
  return new Promise((resolve, reject) => {
    db.query(
      'DELETE FROM carrito WHERE id_cliente = ? AND id_producto = ?',
      [id_cliente, id_producto],
      (err) => {
        if (err) return reject(err);
        resolve({ message: 'Producto eliminado del carrito' });
      }
    );
  });
};

module.exports = {
  addToCart,
  getCart,
  updateCart,
  removeFromCart
};
