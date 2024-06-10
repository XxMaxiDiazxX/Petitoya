const bcrypt = require('bcrypt');
const db = require('../models/db');
const logger = require('../utils/logger');
const sendPasswordChangeEmail = require('../utils/emailService');

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
    // Llamar al procedimiento almacenado para autenticar al usuario
    db.query('CALL AutenticarUsuario(?, @p_contrasena, @p_nombre, @p_id_rol)', [documento], async (err) => {
      if (err) {
        logger.error('Error al llamar al procedimiento almacenado:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }

      // Obtener los resultados del procedimiento almacenado
      db.query('SELECT @p_contrasena AS contrasena, @p_nombre AS nombre, @p_id_rol AS id_rol', async (err, result) => {
        if (err) {
          logger.error('Error al obtener resultados del procedimiento almacenado:', err);
          return res.status(500).json({ error: 'Error interno del servidor' });
        }

        if (result && result.length > 0) {
          const hashedPassword = result[0].contrasena;
          const match = await bcrypt.compare(contrasena, hashedPassword);

          if (match) {
            const user = {
              id: documento,
              username: result[0].nombre,
              role: result[0].id_rol
            };
            return res.status(200).json({ message: 'Inicio de sesión exitoso', user });
          } else {
            return res.status(401).json({ error: 'Usuario y/o contraseña incorrectas' });
          }
        } else {
          return res.status(404).json({ error: 'Usuario no encontrado' });
        }
      });
    });
  } catch (error) {
    logger.error('Error al verificar la contraseña:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};


exports.changePassword = async (req, res) => {
  const { id_cliente, nueva_contrasena } = req.body;

  try {
    // Obtener los datos del cliente
    const [cliente] = await db.query('SELECT nombre, correo_electronico FROM clientes WHERE id_cliente = ?', [id_cliente]);

    if (!cliente) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const { nombre, correo_electronico } = cliente;

    // Cambia la contraseña en la base de datos usando tu procedimiento almacenado
    await db.query('CALL CambiarContrasena(?, ?)', [id_cliente, nueva_contrasena]);

    // Enviar el correo de notificación
    sendPasswordChangeEmail(correo_electronico, nombre);

    res.status(200).json({ message: 'Contraseña cambiada exitosamente' });
  } catch (error) {
    logger.error('Error al cambiar la contraseña:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


