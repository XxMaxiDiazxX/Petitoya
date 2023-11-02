<?php
$nombre = $_POST['nombre'];
$apellido = $_POST['apellido'];
$documento = $_POST['documento'];
$correo_electronico = $_POST['correo_electronico'];
$contrasena = $_POST['contrasena'];

// Verificar si el usuario ya existe en la base de datos (puedes hacerlo usando el campo "documento" o "correo_electronico")

$verificar_sql = "SELECT * FROM clientes WHERE documento = '$documento' OR correo_electronico = '$correo_electronico'";
$verificar_result = $conn->query($verificar_sql);

if ($verificar_result->num_rows > 0) {
    // El usuario ya existe
    header("Location: registro.php?error=1"); // Redirige con un parámetro de error
    exit();
}

// Insertar el nuevo usuario en la base de datos
$fecha_creacion = date("Y-m-d H:i:s"); // Fecha actual
$insertar_sql = "INSERT INTO clientes (nombre, apellido, documento, correo_electronico, contrasena, fecha_creacion)
                VALUES ('$nombre', '$apellido', '$documento', '$correo_electronico', '$contrasena', '$fecha_creacion')";

if ($conn->query($insertar_sql) === TRUE) {
    // Registro exitoso
    header("Location: registro_exitoso.php"); // Redirige a una página de registro exitoso
    exit();
} else {
    // Error en el registro
    header("Location: registro.php?error=2"); // Redirige con un parámetro de error
    exit();
}

$conn->close();
?>