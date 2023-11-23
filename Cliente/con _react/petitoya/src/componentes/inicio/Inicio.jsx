
import { Producto } from "./Producto";

export const Inicio = () => (
  <>
      <div className="MenuDelDia">
      <img src="img/cafe.jpg" alt="" />
      <h1>Comida del Día</h1>
      <p>
        Disfruta de nuestra deliciosa comida del día, cuidadosamente preparada por nuestros chefs para satisfacer tus papilas gustativas. Nuestra comida del día incluye una variedad de opciones frescas y deliciosas que seguramente te encantarán. ¡No te lo pierdas!
      </p>
    </div>
    <div className="sugerencias container text-center">
    <h2 className="mt-3">Sugerencias</h2>
    <div className="row">
      <div className="comidas col-md-6 red">
        <h4>Comidas</h4>
        <div className="row">
          <Producto imgSrc="img/cafe.jpg" alt="" description="Café gourmet El mejor café 250g" price="$ 12.000" />
          <Producto imgSrc="img/cafe.jpg" alt="" description="Té verde Fuente de antioxidantes 100g" price="$ 10.000" />
          {/* Agrega más productos según sea necesario */}
        </div>
      </div>
      <div className="comidas col-md-6 red">
        <h4>Comidas</h4>
        <div className="row">
          <Producto imgSrc="img/cafe.jpg" alt="" description="Café gourmet El mejor café 250g" price="$ 12.000" />
          <Producto imgSrc="img/cafe.jpg" alt="" description="Té verde Fuente de antioxidantes 100g" price="$ 10.000" />
          {/* Agrega más productos según sea necesario */}
        </div>
      </div>
    </div>
  </div>
  </>
);
