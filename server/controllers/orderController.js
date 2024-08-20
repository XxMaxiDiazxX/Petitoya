const orderService = require('../services/orderService');
const logger = require('../utils/logger');

// Ver el historial de pedidos por cliente
exports.getOrdersByClient = async (req, res) => {
  const id_cliente = req.params.id_cliente;

  try {
    const orders = await orderService.getOrdersByClient(id_cliente);
    res.status(200).json(orders);
  } catch (error) {
    logger.error('Error al consultar el historial de pedidos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener detalles del pedido por ID
exports.getOrderDetails = async (req, res) => {
  const id_pedido = req.params.id_pedido;

  try {
    const details = await orderService.getOrderDetails(id_pedido);
    res.status(200).json(details);
  } catch (error) {
    logger.error('Error al consultar los detalles del pedido:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Realizar un pedido desde el carrito
exports.placeOrder = async (req, res) => {
  const { id_cliente } = req.body;

  try {
    const result = await orderService.placeOrder(id_cliente);
    res.status(200).json(result);
  } catch (error) {
    logger.error('Error al realizar el pedido:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
