import React from "react";

const Producto = React.memo(({ nombre, descripcion, precio, imagenSrc, onClick }) => {
  // Verificar si imagenSrc tiene un valor antes de usarlo
  console.log(imagenSrc);
  if (!imagenSrc) {
    return null; // O mostrar un mensaje de carga, o manejar el caso de imagen no disponible
  }

  return (
    <div className="producto row bg-white mt-4 rounded" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className='col-md-2 d-flex align-items-center justify-content-center' style={{ minWidth: '120px' }}>
        <img
          className="rounded-circle"
          src={imagenSrc} // Usar imagenSrc directamente
          alt={nombre}
          style={{ width: '90px', height: '90px' }}
        />
      </div>
      <div className="col-md">
        <h5 className="card-title">{nombre}</h5>
        <p className="card-text">{descripcion}</p>
        <p className="card-text">{`Precio: ${precio}`}</p>
      </div>
    </div>
  );
});

export default Producto;
