const fs = require('fs');
const db = require('../models/db');
const logger = require('../utils/logger');
const path = require('path');

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
          imagenSrc: producto.imagen,  // Asume que producto.imagen es el nombre de archivo de la imagen
          estado: producto.estado
        };
      });

      return res.status(200).json(productosConImagenes);
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


exports.getInactiveProducts = (req, res) => {
  db.query('SELECT * FROM productos WHERE estado = "inactivo"', (err, result) => {
    if (err) {
      logger.error('Error al consultar la base de datos:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.status(200).json(result);
    }
  });
};


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



exports.getLeastUsedProducts = (req, res) => {
  const query = `
    SELECT 
        sub.id_producto,
        sub.nombre,
        sub.descripcion,
        sub.precio,
        sub.categoria,
        sub.cantidad_pedidos,
        sub.imagen
    FROM (
        (SELECT 
            p.id_producto,
            p.nombre,
            p.descripcion,
            p.precio,
            p.categoria,
            p.imagen,
            COUNT(pp.id_pedido) AS cantidad_pedidos
        FROM 
            productos p
        LEFT JOIN 
            pedido_producto pp ON p.id_producto = pp.id_producto
        WHERE 
            p.categoria = 'Comida' AND p.estado = 'activo'
        GROUP BY 
            p.id_producto, p.nombre, p.descripcion, p.precio, p.categoria, p.imagen
        ORDER BY 
            cantidad_pedidos ASC
        LIMIT 4)
        
        UNION ALL
        
        (SELECT 
            p.id_producto,
            p.nombre,
            p.descripcion,
            p.precio,
            p.categoria,
            p.imagen,
            COUNT(pp.id_pedido) AS cantidad_pedidos
        FROM 
            productos p
        LEFT JOIN 
            pedido_producto pp ON p.id_producto = pp.id_producto
        WHERE 
            p.categoria = 'Bebida' AND p.estado = 'activo'
        GROUP BY 
            p.id_producto, p.nombre, p.descripcion, p.precio, p.categoria, p.imagen
        ORDER BY 
            cantidad_pedidos ASC
        LIMIT 4)
    ) AS sub
    ORDER BY sub.cantidad_pedidos ASC;`;

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      if (result.length > 0) {
        // Mapear los resultados para construir la respuesta
        const productosMenosUsados = result.map(producto => {
          return {
            id_producto: producto.id_producto,
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            precio: producto.precio,
            categoria: producto.categoria,
            cantidad_pedidos: producto.cantidad_pedidos,
            imagenSrc: producto.imagen
          };
        });

         res.status(200).json(productosMenosUsados);
      } else {
         res.status(404).json({ message: 'No se encontraron productos menos usados.' });
      }
    }
  });
};
