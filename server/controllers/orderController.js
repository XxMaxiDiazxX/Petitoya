const db = require('../models/db');
const logger = require('../utils/logger');

// Ver el historial de pedidos por cliente
exports.getOrdersByClient = (req, res) => {
  const id_cliente = req.params.id_cliente;

  db.query('SELECT * FROM pedidos WHERE id_cliente = ?', [id_cliente], (err, result) => {
    if (err) {
      logger.error('Error al consultar la base de datos:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.status(200).json(result);
    }
  });
};

// Realizar pedido desde el carrito
exports.placeOrder = (req, res) => {
  const { id_cliente } = req.body; // Obtener el id_cliente desde el cuerpo de la solicitud
  
  // Consulta para realizar el pedido
  const realizarPedidoQuery = `CALL RealizarPedidoDesdeCarrito(?, @p_id_pedido, @p_message)`;

  // Ejecutar la consulta para realizar el pedido
  db.query(realizarPedidoQuery, [id_cliente], (error, results) => {
    if (error) {
      console.error('Error al realizar el pedido:', error);
      return res.status(500).json({ message: 'Error al realizar el pedido' });
    }

    // Consulta para obtener las variables de salida del procedimiento almacenado
    const obtenerResultadoQuery = `SELECT @p_id_pedido AS id_pedido, @p_message AS message`;

    // Ejecutar la consulta para obtener las variables de salida
    db.query(obtenerResultadoQuery, (error, results) => {
      if (error) {
        console.error('Error al obtener el resultado del procedimiento almacenado:', error);
        return res.status(500).json({ message: 'Error al realizar el pedido' });
      }

      // Obtener resultados del procedimiento almacenado
      const { id_pedido, message } = results[0];
      if (id_pedido) {
        return res.status(200).json({ id_pedido, message });
      } else {
        return res.status(400).json({ message });
      }
    });
  });
};
