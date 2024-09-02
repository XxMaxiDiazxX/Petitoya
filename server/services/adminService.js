const db = require("../models/db");

const getSuperUsuarios = (callback) => {
  const sql = 'SELECT * FROM clientes WHERE id_rol = ?';
  const values = [2]; // '2' es el id_rol para superusuarios

  db.query(sql, values, (err, rows) => {
    if (err) {
      logger.error('Error al obtener superusuarios:', err);
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
};


module.exports = {
  getSuperUsuarios,
};
