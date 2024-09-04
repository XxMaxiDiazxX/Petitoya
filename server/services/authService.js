const bcrypt = require("bcrypt");
const crypto = require("crypto");
const db = require("../models/db");
const logger = require("../utils/logger");
const { sendPasswordChangeEmail } = require("../utils/emailService");

// Encriptar contrasena
const encriptarContrasena = async (contrasena) => {
  try {
    const salt = "$2b$10$1qAZ.HvYnoX0ZomDnkgiIu"; // Cambia esto por un salt único y seguro
    const hash = await bcrypt.hash(contrasena, salt);
    return hash;
  } catch (error) {
    throw new Error("Error al encriptar la contraseña");
  }
};

// Verificar ID, correo electrónico y teléfono
const verificarDatosUnicos = (documento, correo_electronico, telefono) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT id_cliente FROM clientes WHERE id_cliente = ?",
      [documento],
      (err, idResults) => {
        if (err) return reject(err);
        if (idResults.length > 0)
          return resolve({ error: "El ID del cliente ya existe" });

        db.query(
          "SELECT correo_electronico FROM clientes WHERE correo_electronico = ?",
          [correo_electronico],
          (err, correoResults) => {
            if (err) return reject(err);
            if (correoResults.length > 0)
              return resolve({ error: "El correo electrónico ya existe" });

            db.query(
              "SELECT telefono FROM clientes WHERE telefono = ?",
              [telefono],
              (err, telefonoResults) => {
                if (err) return reject(err);
                if (telefonoResults.length > 0)
                  return resolve({ error: "El teléfono ya existe" });

                resolve({ error: null });
              }
            );
          }
        );
      }
    );
  });
};

const getUserById = (id_cliente, callback) => {
  // Consulta para obtener los datos del usuario por id_cliente
  db.query(
    'SELECT nombre, apellido, correo_electronico, telefono FROM clientes WHERE id_cliente = ?',
    [id_cliente],
    (err, result) => {
      if (err) {
        logger.error('Error al obtener el usuario:', err);
        callback(err, null);
      } else {
        if (result.length > 0) {
          // Retorna los datos del usuario si se encontró un registro
          console.log(result[0]);
          callback(null, result[0]);
        } else {
          // Retorna un error si no se encontró el usuario
          callback(new Error('Usuario no encontrado'), null);
        }
      }
    }
  );
};

// Registrar un nuevo usuario
const registrarUsuario = async (
  documento,
  nombre,
  apellido,
  correo_electronico,
  telefono,
  contrasena,
  rol
) => {
  try {
    const hashedPassword = await encriptarContrasena(contrasena);
    await db.query("CALL CrearUsuario(?, ?, ?, ?, ?, ?, ?)", [
      documento,
      nombre,
      apellido,
      correo_electronico,
      telefono,
      hashedPassword,
      rol,
    ]);
  } catch (error) {
    throw error;
  }
};

// Autenticar usuario
const autenticarUsuario = (documento) => {
  return new Promise((resolve, reject) => {
    db.query(
      "CALL AutenticarUsuario(?, @p_contrasena, @p_nombre, @p_id_rol)",
      [documento],
      (err) => {
        if (err) return reject(err);
        db.query(
          "SELECT @p_contrasena AS contrasena, @p_nombre AS nombre, @p_id_rol AS id_rol",
          (err, result) => {
            if (err) return reject(err);
            if (result && result.length > 0) {
              const user = result[0];
              if (user.contrasena && user.nombre && user.id_rol) {
                resolve(user);
              } else {
                resolve(null);
              }
            } else {
              resolve(null);
            }
          }
        );
      }
    );
  });
};

const actualizarUsuario = (userData, callback) => {
  const { id_cliente, nombre, apellido, correo_electronico, telefono } = userData;

  // Consulta para obtener los datos actuales del usuario
  db.query('SELECT nombre, apellido, correo_electronico, telefono FROM clientes WHERE id_cliente = ?', [id_cliente], (err, result) => {
    if (err) {
      logger.error('Error al obtener los datos actuales del usuario:', err);
      callback(err, null);
    } else {

      // Llamada al procedimiento almacenado para actualizar el usuario
      db.query(
        'CALL ModificarUsuario(?, ?, ?, ?, ?)',
        [id_cliente, nombre, apellido, correo_electronico, telefono],
        (err, result) => {
          if (err) {
            logger.error('Error al actualizar el usuario:', err);
            callback(err, null);
          } else {
            callback(null, result);
          }
        }
      );
    }
  });
};


// Solicitar restablecimiento de contraseña
const solicitarRestablecimientoContrasena = (correo_electronico) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT id_cliente, nombre FROM clientes WHERE correo_electronico = ?",
      [correo_electronico],
      (err, result) => {
        if (err) return reject(err);
        if (!result || result.length === 0)
          return resolve({ error: "Correo electrónico no encontrado" });

        const { id_cliente, nombre } = result[0];
        const codigo_verificacion = crypto
          .randomBytes(3)
          .toString("hex")
          .toUpperCase();

        global.passwordResetCodes = global.passwordResetCodes || {};
        global.passwordResetCodes[id_cliente] = codigo_verificacion;

        sendPasswordChangeEmail(
          correo_electronico,
          nombre,
          codigo_verificacion
        );
        resolve({ id_cliente });
      }
    );
  });
};

// Verificar código y restablecer contraseña
const verificarCodigoYRestablecerContrasena = async (
  id_cliente,
  codigo_verificacion,
  nueva_contrasena
) => {
  if (
    !global.passwordResetCodes ||
    global.passwordResetCodes[id_cliente] !== codigo_verificacion
  ) {
    throw new Error("Código de verificación inválido o expirado");
  }

  const hashedPassword = await encriptarContrasena(nueva_contrasena);
  await db.query("CALL CambiarContrasena(?, ?)", [id_cliente, hashedPassword]);

  delete global.passwordResetCodes[id_cliente];
};

module.exports = {
  encriptarContrasena,
  verificarDatosUnicos,
  registrarUsuario,
  autenticarUsuario,
  actualizarUsuario,
  solicitarRestablecimientoContrasena,
  verificarCodigoYRestablecerContrasena,
  getUserById,
};
