const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Directorio donde se guardarán los archivos subidos
const fs = require('fs');
const bcrypt = require('bcrypt');

async function encriptarContraseña(contraseña) {
  try {
    const hash = await bcrypt.hash(contraseña, 10); // 10 es el número de rondas de hashing
    return hash;
  } catch (error) {
    throw error;
  }
}

app.use(cors());

app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'petitoya'
});

/*app.post("/create", (req, res) => {
  const documento = req.body.documento;
  const nombre = req.body.nombre;
  const correo_electronico = req.body.correo_electronico;
  const telefono = req.body.telefono;
  const contrasena = req.body.contrasena;

  db.query('INSERT INTO clientes (id_cliente, nombre, correo_electronico, telefono, contrasena, fecha_creacion) VALUES (?,?,?,?,?,NOW())', [documento, nombre, correo_electronico, telefono, contrasena],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        // Verifica si se insertó correctamente y devuelve información del usuario
        if (result.affectedRows > 0) {
          const user = {
            documento: documento,
            nombre: nombre,
            correo_electronico: correo_electronico,
            telefono: telefono,
          };
          res.status(200).json({ message: 'Registro exitoso', user });
        } else {
          res.status(500).json({ error: 'No se pudo insertar el usuario' });
        }
      }
    }
  );
});*/

app.post("/create", async (req, res) => {
  const documento = req.body.documento;
  const nombre = req.body.nombre;
  const correo_electronico = req.body.correo_electronico;
  const telefono = req.body.telefono;
  const contrasena = req.body.contrasena;

  try {
    const hashedPassword = await encriptarContraseña(contrasena);

    db.query('INSERT INTO clientes (id_cliente, nombre, correo_electronico, telefono, contrasena, fecha_creacion) VALUES (?,?,?,?,?,NOW())', [documento, nombre, correo_electronico, telefono, hashedPassword],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({ error: 'Error interno del servidor' });
        } else {
          // Verifica si se insertó correctamente y devuelve información del usuario
          if (result.affectedRows > 0) {
            const user = {
              documento: documento,
              nombre: nombre,
              correo_electronico: correo_electronico,
              telefono: telefono,
            };
            res.status(200).json({ message: 'Registro exitoso', user });
          } else {
            res.status(500).json({ error: 'No se pudo insertar el usuario' });
          }
        }
      }
    );
  } catch (error) {
    console.error('Error al encriptar la contraseña:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/*app.post("/login", (req, res) => {
  const { documento, contrasena } = req.body;

  db.query('SELECT * FROM CLIENTES WHERE id_cliente = ? AND contrasena = ?', [documento, contrasena], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      if (result.length > 0) {
        const user = {
          id: result[0].id_cliente,
          username: result[0].nombre,
          isAdmin: result[0].Administrador === 1,
        };
        // Inicio de sesión exitoso
        res.status(200).json({ message: 'Inicio de sesión exitoso', user });
      } else {
        // Credenciales incorrectas
        res.status(401).json({ error: 'Usuario y/o contraseña incorrectas' });
      }
    }
  });
});*/

app.post("/login", async (req, res) => {
  const { documento, contrasena } = req.body;

  try {
    // Consulta la base de datos para obtener el hash de la contraseña almacenada
    db.query('SELECT contrasena FROM clientes WHERE id_cliente = ?', [documento], async (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        if (result.length > 0) {
          const hashedPassword = result[0].contrasena;

          // Compara el hash almacenado con el hash de la contraseña proporcionada
          const match = await bcrypt.compare(contrasena, hashedPassword);

          if (match) {
            // Inicio de sesión exitoso
            const user = {
              id: documento,
              username: '', // Puedes agregar el nombre de usuario si lo tienes almacenado en la base de datos
            };
            res.status(200).json({ message: 'Inicio de sesión exitoso', user });
          } else {
            // Credenciales incorrectas
            res.status(401).json({ error: 'Usuario y/o contraseña incorrectas' });
          }
        } else {
          // Usuario no encontrado en la base de datos
          res.status(404).json({ error: 'Usuario no encontrado' });
        }
      }
    });
  } catch (error) {
    console.error('Error al verificar la contraseña:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para obtener todos los productos
app.get("/productos", (req, res) => {
  db.query('SELECT * FROM productos', (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.status(200).json(result);
    }
  });
});

app.get('/pedidos', (req, res) => {
  db.query('SELECT * FROM pedidos', (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.status(200).json(result);
    }
  });
});
// Agrega una nueva ruta para obtener pedidos de un cliente específico
app.get('/pedidos/cliente/:id_cliente', (req, res) => {
  const id_cliente = req.params.id_cliente;

  db.query('SELECT * FROM pedidos WHERE id_cliente = ?', [id_cliente], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.status(200).json(result);
    }
  });
});


// Ruta para obtener productos por categoría
app.get("/productos/:categoria", (req, res) => {
  const categoria = req.params.categoria;
  db.query('SELECT * FROM productos WHERE categoria = ?', [categoria], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.status(200).json(result);
    }
  });
});

// Ruta para crear un nuevo producto
app.post("/productos", upload.single('imagen'), (req, res) => {
  // Acceder al archivo subido
  const imagen = req.file;

  // Resto de los datos del producto
  const { id_producto, nombre, descripcion, precio, categoria, estado } = req.body;

  // Leer los datos binarios de la imagen
  const imagenBinaria = fs.readFileSync(imagen.path);

  db.query(
    'INSERT INTO productos (id_producto, nombre, descripcion, precio, fecha_creacion, categoria, imagen) VALUES (?, ?, ?, ?, NOW(), ?, ?)',
    [id_producto, nombre, descripcion, precio, categoria, estado, imagenBinaria],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        res.status(200).json({ message: 'Producto creado exitosamente' });
      }
    }
  );
});

app.put("/productos/:id_producto", (req, res) => {
  const id_producto = req.params.id_producto;
  const { nombre, descripcion, precio, categoria } = req.body;

  // Aquí deberías tener la lógica para actualizar el producto en la base de datos
  db.query(
    'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, categoria = ? WHERE id_producto = ?',
    [nombre, descripcion, precio, categoria, id_producto],
    (err, result) => {
      if (err) {
        console.error('Error al actualizar el producto:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        res.status(200).json({ message: 'Producto actualizado exitosamente' });
      }
    }
  );
});

// Ruta para eliminar un producto
// Ruta para desactivar (eliminar lógicamente) un producto
app.put("/productos/desactivar/:id_producto", (req, res) => {
  const id_producto = req.params.id_producto;

  // Actualiza el estado del producto a "inactivo"
  db.query(
    'UPDATE productos SET estado = ? WHERE id_producto = ?',
    ['inactivo', id_producto],
    (err, result) => {
      if (err) {
        console.error('Error al desactivar el producto:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
      } else {
        res.status(200).json({ message: 'Producto desactivado exitosamente' });
      }
    }
  );
});


app.listen(3001, () => {
  console.log("Corriendo en el puerto 3001");
});