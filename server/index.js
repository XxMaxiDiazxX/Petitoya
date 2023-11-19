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

app.post("/create", (req, res) =>{
    const id = req.body.id;
    const nombre = req.body.nombre;
    const direccion = req.body.direccion;
    const correo_electronico = req.body.correo_electronico;
    const telefono = req.body.telefono;
    const contrasena = req.body.contrasena;

    db.query('INSERT INTO CLIENTES (id_cliente,nombre,direccion,correo_electronico,telefono,contrasena) VALUES (?,?,?,?,?,?,Now())', [id, nombre, direccion, correo_electronico, telefono, contrasena],
    (err, result) => {
        if(err){
            console.log(err);
        }else{
            res.send(result);
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
                // Inicio de sesión exitoso
                res.status(200).json({ message: 'Inicio de sesión exitoso' });
            } else {
                // Credenciales incorrectas
                res.status(401).json({ error: 'Usuario y/o contraseña incorrectas' });
            }
        }
    });
});


app.listen(3001,()=>{
    console.log("Corriendo en el puerto 3001");
});