// src/services/productService.js
const db = require('../models/db');
const logger = require('../utils/logger');
const path = require('path');
const fs = require('fs');

const getProducts = (callback) => {
  db.query('SELECT * FROM productos', (err, result) => {
    if (err) {
      logger.error('Error al consultar la base de datos:', err);
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

const getProductsByCategory = (categoria, callback) => {
  db.query('SELECT * FROM productos WHERE categoria = ?', [categoria], (err, result) => {
    if (err) {
      logger.error('Error al consultar la base de datos:', err);
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

const getInactiveProducts = (callback) => {
  db.query('SELECT * FROM productos WHERE estado = "inactivo"', (err, result) => {
    if (err) {
      logger.error('Error al consultar la base de datos:', err);
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

const createProduct = (productData, callback) => {
  const { id_producto, nombre, descripcion, precio, categoria, imagenRuta } = productData;

  db.query(
    'CALL CrearProducto(?, ?, ?, ?, ?, ?)',
    [id_producto, nombre, descripcion, precio, categoria, imagenRuta],
    (err, result) => {
      if (err) {
        logger.error('Error al insertar producto en la base de datos:', err);
        callback(err, null);
      } else {
        callback(null, result);
      }
    }
  );
};

const updateProduct = (productData, callback) => {
  const { id_producto, nombre, descripcion, precio, categoria, imagen } = productData;

  db.query('SELECT imagen FROM productos WHERE id_producto = ?', [id_producto], (err, result) => {
    if (err) {
      logger.error('Error al obtener la imagen anterior:', err);
      callback(err, null);
    } else {
      const oldImage = result[0]?.imagen;
      if (oldImage && imagen) {
        const oldImagePath = path.join(path.join(__dirname, '../uploads'), path.basename(oldImage));
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            logger.error('Error al eliminar la imagen anterior:', err);
          }
        });
      }

      db.query(
        'CALL ModificarProducto(?, ?, ?, ?, ?, ?)',
        [id_producto, nombre, descripcion, precio, categoria, imagen],
        (err, result) => {
          if (err) {
            logger.error('Error al actualizar el producto:', err);
            callback(err, null);
          } else {
            callback(null, result);
          }
        }
      );
    }
  });
};

const deactivateProduct = (id_producto, callback) => {
  db.query(
    'CALL DesactivarProducto(?)',
    [id_producto],
    (err, result) => {
      if (err) {
        logger.error('Error al desactivar el producto:', err);
        callback(err, null);
      } else {
        callback(null, result);
      }
    }
  );
};

const activateProduct = (id_producto, callback) => {
  db.query(
    'CALL HabilitarProducto(?)',
    [id_producto],
    (err, result) => {
      if (err) {
        logger.error('Error al habilitar el producto:', err);
        callback(err, null);
      } else {
        callback(null, result);
      }
    }
  );
};

const getLeastUsedProducts = (callback) => {
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
    ORDER BY sub.cantidad_pedidos ASC;
  `;

  db.query(query, (err, result) => {
    if (err) {
      logger.error('Error al consultar la base de datos:', err);
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};




// Almacena en memoria para este ejemplo
let carouselItems = [];

const addCarouselItem = (itemData, callback) => {
  try {
    const newItem = {
      id: Date.now(), // Generar un ID único
      ...itemData,
    };

    carouselItems.push(newItem);
    callback(null, newItem);
  } catch (error) {
    callback(error, null);
  }
  console.log(carouselItems)
};

const getCarouselItems = (callback) => {
  try {
    callback(null, carouselItems);
  } catch (error) {
    callback(error, null);
  }
};

// Función para eliminar imágenes relacionadas
const removeCarouselImages = () => {
  const promises = carouselItems.map((item) => {
    // Ajusta la ruta para ir un directorio atrás
    const filePath = path.resolve(__dirname, '..', 'uploads', path.basename(item.imagenRuta)); // 'uploads' para acceder al directorio de imágenes
    console.log(`Intentando eliminar la imagen en: ${filePath}`);
    
    return new Promise((resolve, reject) => {
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          console.log(`La imagen en ${filePath} no existe.`);
          resolve(); // Continuamos incluso si la imagen no existe
        } else {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(`Error al eliminar ${filePath}:`, err);
              reject(err);
            } else {
              console.log(`Imagen ${filePath} eliminada.`);
              resolve();
            }
          });
        }
      });
    });
  });

  // Esperamos a que todas las promesas se completen
  return Promise.all(promises);
};

// Limpiar ítems al apagar el servidor
process.on('exit', async () => {
  console.log('Servidor apagándose. Limpiando ítems del carrusel...');
  await removeCarouselImages();
  carouselItems = [];
});

// Manejo de interrupciones (CTRL+C)
process.on('SIGINT', async () => {
  console.log('Interrupción recibida. Limpiando ítems del carrusel...');
  
  await removeCarouselImages(); // Asegura que las imágenes se eliminen antes de salir
  process.exit(0); // Luego cierra el proceso
});

// Manejo de errores no atrapados
process.on('uncaughtException', async (err) => {
  console.error('Excepción no atrapada:', err);
  await removeCarouselImages(); // Limpiar imágenes en caso de error
  process.exit(1); // Luego cierra el proceso con error
});


module.exports = {
  getProducts,
  getProductsByCategory,
  getInactiveProducts,
  createProduct,
  updateProduct,
  deactivateProduct,
  activateProduct,
  getLeastUsedProducts,
  addCarouselItem,
  getCarouselItems,
};
