const authService = require('../services/authService');
const logger = require('../utils/logger');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  const { documento, nombre, correo_electronico, telefono, contrasena } = req.body;

  try {
    const { error } = await authService.verificarDatosUnicos(documento, correo_electronico, telefono);
    if (error) {
      return res.status(400).json({ error });
    }

    await authService.registrarUsuario(documento, nombre, correo_electronico, telefono, contrasena, 1);
    res.status(200).json({ message: 'Registro exitoso' });
  } catch (error) {
    logger.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.registerSu = async (req, res) => {
  const { documento, nombre, correo_electronico, telefono, contrasena } = req.body;

  try {
    await authService.registrarUsuario(documento, nombre, correo_electronico, telefono, contrasena, 3);
    res.status(200).json({ message: 'Registro exitoso' });
  } catch (error) {
    logger.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.login = async (req, res) => {
  const { documento, contrasena } = req.body;

  try {
    const user = await authService.autenticarUsuario(documento);
    if (user) {
      const match = await bcrypt.compare(contrasena, user.contrasena);
      if (match) {
        const userResponse = {
          id: documento,
          username: user.nombre,
          role: user.id_rol
        };
        return res.status(200).json({ message: 'Inicio de sesión exitoso', user: userResponse });
      } else {
        return res.status(401).json({ error: 'Usuario y/o contraseña incorrectas' });
      }
    } else {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    logger.error('Error al verificar la contraseña:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.requestPasswordReset = async (req, res) => {
  const { correo_electronico } = req.body;

  if (!correo_electronico) {
    return res.status(400).json({ error: 'Correo electrónico es requerido' });
  }

  try {
    const { error, id_cliente } = await authService.solicitarRestablecimientoContrasena(correo_electronico);
    if (error) {
      return res.status(404).json({ error });
    }

    res.status(200).json({ message: 'Código de verificación enviado a tu correo electrónico', id_cliente });
  } catch (error) {
    logger.error('Error al solicitar restablecimiento de contraseña:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.verifyCodeAndResetPassword = async (req, res) => {
  const { id_cliente, codigo_verificacion, nueva_contrasena } = req.body;

  try {
    await authService.verificarCodigoYRestablecerContrasena(id_cliente, codigo_verificacion, nueva_contrasena);
    res.status(200).json({ message: 'Contraseña cambiada exitosamente' });
  } catch (error) {
    logger.error('Error al restablecer la contraseña:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
