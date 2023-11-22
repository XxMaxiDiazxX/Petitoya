const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');

app.use(cors());

app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'petitoya'
});

app.post("/create", (req, res) => {
    const documento = req.body.documento;
    const nombre = req.body.nombre;
    const correo_electronico = req.body.correo_electronico;
    const telefono = req.body.telefono;
    const contrasena = req.body.contrasena;

    db.query('INSERT INTO clientes VALUES (?,?,?,?,?,NOW())', [documento, nombre, correo_electronico, telefono, contrasena],
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
});

app.post("/login", (req, res) => {
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
                };
                // Inicio de sesión exitoso
                res.status(200).json({ message: 'Inicio de sesión exitoso', user });
            } else {
                // Credenciales incorrectas
                res.status(401).json({ error: 'Usuario y/o contraseña incorrectas' });
            }
        }
    });
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
  app.post("/productos", (req, res) => {
    const { nombre, descripcion, precio, fecha_creacion, fecha_publicacion, categoria } = req.body;
    db.query('INSERT INTO productos (nombre, descripcion, precio, fecha_creacion, fecha_publicacion, categoria) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, descripcion, precio, fecha_creacion, fecha_publicacion, categoria],
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


app.listen(3001, () => {
    console.log("Corriendo en el puerto 3001");
});