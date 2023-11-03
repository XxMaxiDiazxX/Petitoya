import "../styles/index.css"

export const Login = () => {
  return (
      <div class="cont-cont">
        <div class="contefoto"></div>
        <div class="relleno">
          <h4>Inicio Sesion</h4>
          <form action="php/inicio sesion.php" class="mames" onsubmit="return validarFormulario()" method="post">
            <input type="text" name="documento" class="usua" placeholder="Documento" required />
            <input id="password" type="password" name="contrasena" class="contra" placeholder="Contraseña" required />
            <span class="error" id="mensajeContrasena"></span>
            <button type="submit">Ingresar</button>
          </form>
          <div class="botones-inferiores">
            <a class="boton-registro" href="/registro">Registro</a>
            <a class="boton-invitado" href="/">Invitado</a>
          </div>
        </div>
      </div>
  );
}

export default Login;
