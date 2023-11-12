function validarFormulario() {
    const contrasena = document.getElementById('password').value;
    const mensajeContrasena = document.getElementById('mensajeContrasena');

    // Verifica que la contraseña tenga al menos 8 caracteres
    if (contrasena.length < 8) {
        mensajeContrasena.textContent = 'La contraseña debe tener al menos 8 caracteres.';
        return false;
    }

    // Verifica que la contraseña contenga al menos un carácter especial, un número, una mayúscula y una minúscula
    const regex = /^(?=.*[!@#$%^&*])(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!regex.test(contrasena)) {
        mensajeContrasena.textContent = 'La contraseña debe contener al menos 1 carácter especial, 1 número, 1 mayúscula y 1 minúscula.';
        return false;
    }

    return true;
}