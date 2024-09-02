const adminService = require("../services/adminService");

const obtenerSuperUsuarios = async (req, res) => {
  adminService.getSuperUsuarios((err, result) => {
    if (err) {
      res.status(500).json({ message: "Error al obtener superusuarios" });
    } else {
      res.status(200).json(result);
    }
  });
};

module.exports = {
  obtenerSuperUsuarios,
};
