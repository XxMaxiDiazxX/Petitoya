import React from "react";

const Producto = React.memo(({ nombre, descripcion, precio, imagenSrc, onClick }) => {
  // Verificar si imagenSrc tiene un valor antes de usarlo
  if (!imagenSrc) {
    return null; // O mostrar un mensaje de carga, o manejar el caso de imagen no disponible
  }

  return (
    <div className="producto bg-white mt-4 rounded" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="producto-img-container">
        <img
          className="producto-img"
          src={imagenSrc} // Usar imagenSrc directamente
          alt={nombre}
        />
      </div>
      <div className="producto-info">
        <h5 className="producto-title">{nombre}</h5>
        <p className="producto-text">{descripcion}</p>
        <p className="producto-text">{`Precio: ${precio}`}</p>
      </div>
    </div>
  );
});

export default Producto;
