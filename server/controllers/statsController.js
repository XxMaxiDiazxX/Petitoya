const statsService = require('../services/statsService');

exports.productosMasComprados = (req, res) => {
  statsService.productosMasComprados((err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.status(200).json(results);
    }
  });
};

exports.productosMenosComprados = (req, res) => {
  statsService.productosMenosComprados((err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.status(200).json(results);
    }
  });
};

exports.ventasDiarias = (req, res) => {
  statsService.ventasDiarias((err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.status(200).json(results);
    }
  });
};

exports.ventasSemanales = (req, res) => {
  statsService.ventasSemanales((err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.status(200).json(results);
    }
  });
};

exports.ventasMensuales = (req, res) => {
  statsService.ventasMensuales((err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.status(200).json(results);
    }
  });
};

