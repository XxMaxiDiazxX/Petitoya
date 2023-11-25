
import { Producto } from "./Producto";
import palmera from '../../img/inicioSesion/fondo.png';

export const Inicio = () => (
  <>
      <div className="MenuDelDia" style={{height: "200px"}}>
      <img src={palmera} alt="" />
      <h1>Comida del Día</h1>
      <p>
        Disfruta de nuestra deliciosa comida del día, cuidadosamente preparada por nuestros chefs para satisfacer tus papilas gustativas. Nuestra comida del día incluye una variedad de opciones frescas y deliciosas que seguramente te encantarán. ¡No te lo pierdas!
      </p>
    </div>
    <div className="sugerencias container text-center">
    <h2 className="mt-3 bg-barra3 cuerpo text-white">Sugerencias</h2>
    <div className="row">
      <div className="comidas col-md-6">
        <h4 className="cuerpo">Comidas</h4>
        <div className="row">
          <Producto imgSrc={palmera} alt="" description="Café gourmet El mejor café 250g" price="$ 12.000" />
          <Producto imgSrc={palmera} alt="" description="Té verde Fuente de antioxidantes 100g" price="$ 10.000" />
          {/* Agrega más productos según sea necesario */}
        </div>
      </div>
      <div className="comidas col-md-6">
        <h4 className="cuerpo">Bebidas</h4>
        <div className="row">
          <Producto imgSrc={palmera} alt="" description="Café gourmet El mejor café 250g" price="$ 12.000" />
          <Producto imgSrc={palmera} alt="" description="Té verde Fuente de antioxidantes 100g" price="$ 10.000" />
          {/* Agrega más productos según sea necesario */}
        </div>
      </div>
    </div>
  </div>
  </>
);
