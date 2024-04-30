const convertirImagenABase64 = (imagenBinaria) => {
  if (imagenBinaria) {
    const base64String = btoa(
      new Uint8Array(imagenBinaria).reduce(
        (datos, byte) => datos + String.fromCharCode(byte),
        ''
      )
    );
    return `data:image/jpeg;base64,${base64String}`;
  }
  return null;
};

const Producto = ({ nombre, descripcion, precio, imagenBinaria }) => {
  const imagenSrc = convertirImagenABase64(imagenBinaria);

  return (
    <div className="producto">
      <img src={imagenSrc} alt={nombre} />
      <h3>{nombre}</h3>
      <p>{descripcion}</p>
      <p>Precio: ${precio}</p>
    </div>
  );
};

export default Producto;
