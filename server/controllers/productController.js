const fs = require('fs');
const db = require('../models/db');
const logger = require('../utils/logger');
const path = require('path');

// exports.getProducts = (req, res) => {
//   db.query('SELECT * FROM productos', (err, result) => {
//     if (err) {
//       logger.error('Error al consultar la base de datos:', err);
//       res.status(500).json({ error: 'Error interno del servidor' });
//     } else {
//       res.status(200).json(result);
//     }
//   });
// };

exports.getProducts = (req, res) => {
  db.query('SELECT * FROM productos', (err, result) => {
    if (err) {
      logger.error('Error al consultar la base de datos:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      // Iterar sobre los resultados y construir la respuesta
      const productosConImagenes = result.map(producto => {
        return {
          id_producto: producto.id_producto,
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: producto.precio,
          categoria: producto.categoria,
          imagenSrc: `../${producto.imagen}`  // Asume que producto.imagen es el nombre de archivo de la imagen
        };
      });

      res.status(200).json(productosConImagenes);
    }
  });
};

exports.getProductsByCategory = (req, res) => {
  const categoria = req.params.categoria;
  db.query('SELECT * FROM productos WHERE categoria = ?', [categoria], (err, result) => {
    if (err) {
      logger.error('Error al consultar la base de datos:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.status(200).json(result);
    }
  });
};

// exports.createProduct = (req, res) => {
//   const imagen = req.file;
//   const { id_producto, nombre, descripcion, precio, categoria } = req.body;

//   const imagenBinaria = fs.readFileSync(imagen.path);

//   db.query(
//     'CALL CrearProducto(?, ?, ?, ?, ?, ?)',
//     [id_producto, nombre, descripcion, precio, categoria, imagenBinaria],
//     (err, result) => {
//       if (err) {
//         logger.error('Error al insertar producto en la base de datos:', err);
//         res.status(500).json({ error: 'Error interno del servidor' });
//       } else {
//         res.status(200).json({ message: 'Producto creado exitosamente' });
//       }
//     }
//   );
// };

exports.createProduct = (req, res) => {
  const imagen = req.file; // Obtiene la imagen subida desde el request
  const { id_producto, nombre, descripcion, precio, categoria } = req.body; // Obtiene los datos del producto desde el body del request

  const imagenRuta = imagen.path; // Obtiene la ruta donde se guarda la imagen en el servidor

  db.query(
    'CALL CrearProducto(?, ?, ?, ?, ?, ?)',
    [id_producto, nombre, descripcion, precio, categoria, imagenRuta],
    (err, result) => {
      if (err) {
        console.error('Error al insertar producto en la base de datos:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        res.status(200).json({ message: 'Producto creado exitosamente' });
      }
    }
  );
};

exports.updateProduct = (req, res) => {
  const id_producto = req.params.id_producto;
  const { nombre, descripcion, precio, categoria } = req.body;

  db.query(
    'CALL ModificarProducto(?, ?, ?, ?, ?)',
    [id_producto, nombre, descripcion, precio, categoria],
    (err, result) => {
      if (err) {
        logger.error('Error al actualizar el producto:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        res.status(200).json({ message: 'Producto actualizado exitosamente' });
      }
    }
  );
};

exports.deactivateProduct = (req, res) => {
  const id_producto = req.params.id_producto;

  db.query(
    'CALL DesactivarProducto(?)',
    [id_producto],
    (err, result) => {
      if (err) {
        logger.error('Error al desactivar el producto:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        res.status(200).json({ message: 'Producto desactivado exitosamente' });
      }
    }
  );
};

exports.activateProduct = (req, res) => {
  const id_producto = req.params.id_producto;

  db.query(
    'CALL HabilitarProducto(?)',
    [id_producto],
    (err, result) => {
      if (err) {
        logger.error('Error al habilitar el producto:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        res.status(200).json({ message: 'Producto habilitado exitosamente' });
      }
    }
  );
};
