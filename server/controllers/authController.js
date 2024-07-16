const bcrypt = require('bcrypt');
const crypto = require('crypto');
const db = require('../models/db');
const logger = require('../utils/logger');
const { sendPasswordChangeEmail } = require('../utils/emailService');
const { Console } = require('console');

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
    console.log("HOLA");
      // Verificar existencia de duplicados antes de intentar crear el usuario
      const verificacion = await db.query('CALL VerificarExistenciaUsuario(?, ?, ?)', [documento, correo_electronico, telefono]);
      console.log(verificacion);
      // Verificar el resultado de la verificación
      if (verificacion && verificacion.length > 0 && verificacion[0].mensaje) {
          // Si la verificación devuelve algún mensaje de error, manejarlo
          const { mensaje } = verificacion[0];
          console.log(mensaje);

          if (mensaje.includes('El ID del cliente ya existe')) {
              return res.status(400).json({ error: 'El ID del cliente ya existe' });
          } else if (mensaje.includes('El correo electrónico ya existe')) {
              return res.status(400).json({ error: 'El correo electrónico ya existe' });
          } else if (mensaje.includes('El teléfono ya existe')) {
              return res.status(400).json({ error: 'El teléfono ya existe' });
          } else {
              return res.status(400).json({ error: 'Ya existe un registro con ese ID, correo electrónico o teléfono.' });
          }
      }

      // Si no hay duplicados, proceder a crear el usuario
      const hashedPassword = await encriptarContrasena(contrasena);
      await db.query('CALL CrearUsuario(?, ?, ?, ?, ?, 1)', [documento, nombre, correo_electronico, telefono, hashedPassword]);
      res.status(200).json({ message: 'Registro exitoso' });

  } catch (error) {
      logger.error('Error al registrar usuario:', error);

      // Manejo de errores específicos de base de datos
      if (error.code === 'ER_DUP_ENTRY') {
          if (error.message.includes('id_cliente')) {
              return res.status(400).json({ error: 'El ID del cliente ya existe' });
          } else if (error.message.includes('correo_electronico')) {
              return res.status(400).json({ error: 'El correo electrónico ya existe' });
          } else if (error.message.includes('telefono')) {
              return res.status(400).json({ error: 'El teléfono ya existe' });
          } else {
              return res.status(400).json({ error: 'Ya existe un registro con ese ID, correo electrónico o teléfono.' });
          }
      } else {
          return res.status(500).json({ error: 'Error interno del servidor' });
      }
  }
};


exports.registerSu = async (req, res) => {
  const { documento, nombre, correo_electronico, telefono, contrasena } = req.body;

  try {
    const hashedPassword = await encriptarContrasena(contrasena);
    await db.query('CALL CrearUsuario(?, ?, ?, ?, ?, 3)', [documento, nombre, correo_electronico, telefono, hashedPassword]);
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


exports.requestPasswordReset = (req, res) => {
  const { correo_electronico } = req.body;

  // Verifica que se haya proporcionado un correo electrónico
  if (!correo_electronico) {
    return res.status(400).json({ error: 'Correo electrónico es requerido' });
  }

  // Realiza la consulta para obtener el id_cliente y nombre asociado al correo electrónico
  db.query('SELECT id_cliente, nombre FROM clientes WHERE correo_electronico = ?', [correo_electronico], (err, result) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    // Verificar si no se encontraron resultados
    if (!result || result.length === 0) {
      return res.status(404).json({ error: 'Correo electrónico no encontrado' });
    }

    // Si se encontraron resultados, obtener id_cliente y nombre
    const { id_cliente, nombre } = result[0]; // Suponiendo que solo se espera un resultado

    // Generar el código de verificación
    const codigo_verificacion = crypto.randomBytes(3).toString('hex').toUpperCase();

    // Almacenar temporalmente el código en el servidor
    global.passwordResetCodes = global.passwordResetCodes || {};
    global.passwordResetCodes[id_cliente] = codigo_verificacion;

    // Enviar el correo de notificación con el código de verificación
    sendPasswordChangeEmail(correo_electronico, nombre, codigo_verificacion);

    // Responder con éxito
    res.status(200).json({ message: 'Código de verificación enviado a tu correo electrónico', id_cliente });
  });
};


// exports.verifyCodeAndResetPassword = async (req, res) => {
//   const { id_cliente, codigo_verificacion, nueva_contrasena } = req.body;

//   try {
//     // Verificar el código de verificación
//     if (!global.passwordResetCodes || global.passwordResetCodes[id_cliente] !== codigo_verificacion) {
//       return res.status(400).json({ error: 'Código de verificación inválido' });
//     }

//     // Cambiar la contraseña del cliente
//     await db.query('CALL CambiarContrasena(?, ?)', [id_cliente, nueva_contrasena]);

//     // Eliminar el código de verificación del servidor
//     delete global.passwordResetCodes[id_cliente];

//     res.status(200).json({ message: 'Contraseña cambiada exitosamente' });
//   } catch (error) {
//     console.error('Error al restablecer la contraseña:', error);
//     res.status(500).json({ error: 'Error interno del servidor' });
//   }
// };

exports.verifyCodeAndResetPassword = async (req, res) => {
  const { id_cliente, codigo_verificacion, nueva_contrasena } = req.body;

  try {
    // Verificar el código de verificación
    if (!global.passwordResetCodes || !global.passwordResetCodes[id_cliente] || global.passwordResetCodes[id_cliente] !== codigo_verificacion) {
      return res.status(400).json({ error: 'Código de verificación inválido o expirado' });
    }

    // Encriptar la nueva contraseña
    const hashedPassword = await encriptarContrasena(nueva_contrasena);

    // Cambiar la contraseña del cliente en la base de datos
    await db.query('CALL CambiarContrasena(?, ?)', [id_cliente, hashedPassword]);

    // Eliminar el código de verificación del servidor
    delete global.passwordResetCodes[id_cliente];

    // Responder con éxito
    res.status(200).json({ message: 'Contraseña cambiada exitosamente' });
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

