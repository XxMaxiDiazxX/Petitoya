const superUsService = require('../services/superUsService');

exports.getPendingOrders = (req, res) => {
  superUsService.getPendingOrders((err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    res.status(200).json(result);
  });
};

exports.getOrdersByState = (req, res) => {
  const estado = req.params.estado;

  superUsService.getOrdersByState(estado, (err, result) => {
    if (err) {
      if (err.message === 'Estado no válido') {
        return res.status(400).json({ error: 'Estado no válido' });
      }
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    res.status(200).json(result);
  });
};

exports.updateOrderStatus = (req, res) => {
  const { id_pedido } = req.params;
  const { nuevoEstado } = req.body;

  superUsService.updateOrderStatus(id_pedido, nuevoEstado, (err, result) => {
    if (err) {
      if (err.message === 'Estado no válido') {
        return res.status(400).json({ error: 'Estado no válido' });
      }
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    res.status(200).json({ message: 'Estado actualizado correctamente' });
  });
};
