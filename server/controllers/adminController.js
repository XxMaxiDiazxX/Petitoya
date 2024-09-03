const adminService = require("../services/adminService");
const logger = require('../utils/logger');

const obtenerSuperUsuarios = async (req, res) => {
  adminService.getSuperUsuarios((err, result) => {
    if (err) {
      res.status(500).json({ message: "Error al obtener superusuarios" });
    } else {
      res.status(200).json(result);
    }
  });
};

const deleteSuperUsuarioById = (req, res) => {
  const { id } = req.params;

  // Validar que el ID sea un número válido
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  adminService.deleteSuperUsuario(id, (err, result) => {
    if (err) {
      logger.error(`Error al eliminar superusuario con ID ${id}:`, err);
      return res.status(500).json({ error: 'Error al eliminar superusuario' });
    }

    // Verificar si se eliminó algún registro
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Superusuario no encontrado' });
    }

    res.json({ message: `Superusuario con ID ${id} eliminado exitosamente` });
  });
};

module.exports = {
  obtenerSuperUsuarios,
  deleteSuperUsuarioById,
};