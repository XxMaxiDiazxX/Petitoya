<?php
// Incluir el archivo de conexión a la base de datos
include 'conectar.php';

// Recuperar datos del formulario
$documento = $_POST['documento'];
$contrasena = $_POST['contrasena'];

// Consulta SQL para verificar las credenciales del usuario
$sql = "SELECT * FROM clientes WHERE id_cliente = '$documento' AND contrasena = '$contrasena'";
$result = $conn->query($sql);

if ($result->num_rows == 1) {
    // Inicio de sesión exitoso
    session_start();
    $_SESSION['documento'] = $documento;
    header("Location: ../inicio.html"); // Redirige a la página de usuario autenticado
    exit();
} else {
    // Inicio de sesión fallido
    header("Location: inicio_sesion.php?error=1"); // Redirige con un parámetro de error
    exit();
}
$conn->close();


?>
