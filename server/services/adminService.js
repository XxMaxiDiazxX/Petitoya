const db = require("../models/db");
const logger = require('../utils/logger');

const getSuperUsuarios = (callback) => {
  const sql = 'SELECT * FROM clientes WHERE id_rol = ?';
  const values = [3];

  db.query(sql, values, (err, rows) => {
    if (err) {
      logger.error('Error al obtener superusuarios:', err);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
};

const deleteSuperUsuario = (id, callback) => {
  const sql = 'DELETE FROM clientes WHERE id_cliente = ?';
  const values = [id];

  db.query(sql, values, (err, result) => {
    if (err) {
      logger.error('Error al eliminar el superusuario:', err);
      callback(err, null);
    } else {
      logger.info(`Superusuario con ID ${id} eliminado exitosamente.`);
      callback(null, result);
    }
  });
};

module.exports = {
  getSuperUsuarios,
  deleteSuperUsuario,
};
