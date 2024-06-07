const bcrypt = require('bcrypt');
const db = require('../models/db');
const logger = require('../utils/logger');

async function encriptarContrasena(contrasena) {
  try {
    const salt = '$2b$10$1qAZ.HvYnoX0ZomDnkgiIu'; // Cambia esto por un salt único y seguro
    const hash = await bcrypt.hash(contrasena, salt);
    return hash;

  } catch (error) {
    throw new Error('Error al encriptar la contraseña');
}
};

exports.register = async (req, res) => {
  const { documento, nombre, correo_electronico, telefono, contrasena } = req.body;

  try {
    const hashedPassword = await encriptarContrasena(contrasena);
    await db.query('CALL CrearUsuario(?, ?, ?, ?, ?, 1)', [documento, nombre, correo_electronico, telefono, hashedPassword]);
    res.status(200).json({ message: 'Registro exitoso' });
  } catch (error) {
    logger.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.login = async (req, res) => {
  const { documento, contrasena } = req.body;

  try {
    db.query('SELECT contrasena, nombre, Administrador FROM clientes WHERE id_cliente = ?', [documento], async (err, result) => {
      if (err) {
        logger.error('Error al consultar la base de datos:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        if (result.length > 0) {
          const hashedPassword = result[0].contrasena;
          const match = await bcrypt.compare(contrasena, hashedPassword);
          if (match) {
            const user = { id: documento, username: result[0].nombre, isAdmin: result[0].Administrador === 1 };
            res.status(200).json({ message: 'Inicio de sesión exitoso', user });
          } else {
            res.status(401).json({ error: 'Usuario y/o contraseña incorrectas' });
          }
        } else {
          res.status(404).json({ error: 'Usuario no encontrado' });
        }
      }
    });
  } catch (error) {
    logger.error('Error al verificar la contraseña:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
