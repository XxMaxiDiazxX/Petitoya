const productService = require('../services/productService');
const path = require('path');

exports.getProducts = (req, res) => {
  productService.getProducts((err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
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

      res.status(200).json(productosConImagenes);
    }
  });
};

exports.getProductsByCategory = (req, res) => {
  const categoria = req.params.categoria;
  productService.getProductsByCategory(categoria, (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.status(200).json(result);
    }
  });
};

exports.getInactiveProducts = (req, res) => {
  productService.getInactiveProducts((err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.status(200).json(result);
    }
  });
};

exports.createProduct = (req, res) => {
  const imagen = req.file;
  const { id_producto, nombre, descripcion, precio, categoria } = req.body;
  const imagenRuta = imagen.path;

  productService.createProduct({ id_producto, nombre, descripcion, precio, categoria, imagenRuta }, (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.status(200).json({ message: 'Producto creado exitosamente' });
    }
  });
};

exports.updateProduct = (req, res) => {
  const id_producto = req.params.id_producto;
  const { nombre, descripcion, precio, categoria } = req.body;
  let imagen = null;

  if (req.file) {
    imagen = req.file.path;
  }

  if (!nombre || !descripcion || !precio || !categoria) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  productService.updateProduct({ id_producto, nombre, descripcion, precio, categoria, imagen }, (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      if (result.affectedRows === 0) {
        res.status(404).json({ message: 'Producto no encontrado' });
      } else {
        res.status(200).json({ message: 'Producto actualizado exitosamente' });
      }
    }
  });
};

exports.deactivateProduct = (req, res) => {
  const id_producto = req.params.id_producto;
  productService.deactivateProduct(id_producto, (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.status(200).json({ message: 'Producto desactivado exitosamente' });
    }
  });
};

exports.activateProduct = (req, res) => {
  const id_producto = req.params.id_producto;
  productService.activateProduct(id_producto, (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.status(200).json({ message: 'Producto habilitado exitosamente' });
    }
  });
};

exports.getLeastUsedProducts = (req, res) => {
  productService.getLeastUsedProducts((err, result) => {
    if (err) {
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      if (result.length > 0) {
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
