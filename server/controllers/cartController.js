const cartService = require('../services/cartService');
const logger = require('../utils/logger');

// Añadir o actualizar producto en el carrito
exports.addToCart = async (req, res) => {
  const { id_cliente, id_producto, cantidad } = req.body;

  try {
    const result = await cartService.addToCart(id_cliente, id_producto, cantidad);
    res.status(200).json(result);
  } catch (error) {
    logger.error('Error al gestionar el carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener el carrito de un cliente
exports.getCart = async (req, res) => {
  const id_cliente = req.params.id_cliente;

  try {
    const cart = await cartService.getCart(id_cliente);
    res.status(200).json(cart);
  } catch (error) {
    logger.error('Error al consultar el carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Actualizar la cantidad de un producto en el carrito
exports.updateCart = async (req, res) => {
  const { id_cliente, id_producto, cantidad } = req.body;

  try {
    const result = await cartService.updateCart(id_cliente, id_producto, cantidad);
    res.status(200).json(result);
  } catch (error) {
    logger.error('Error al actualizar el carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Eliminar un producto del carrito
exports.removeFromCart = async (req, res) => {
  const { id_cliente, id_producto } = req.params;

  try {
    const result = await cartService.removeFromCart(id_cliente, id_producto);
    res.status(200).json(result);
  } catch (error) {
    logger.error('Error al eliminar producto del carrito:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
