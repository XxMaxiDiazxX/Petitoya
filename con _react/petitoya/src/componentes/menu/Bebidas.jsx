export const Bebidas = ({ nombre, descripcion, precio, imagenSrc }) => {
  return (
    <article className="cartel card mb-3">
      <img className="card-img-top imagen red" src={imagenSrc} alt={`Imagen de ${nombre}`} />
      <div className="card-body">
        <h5 className="card-title nombre">{nombre}</h5>
        <p className="card-text descripcion">{descripcion}</p>
        <p className="card-text precio">${precio}</p>
      </div>
    </article>
  )
}
