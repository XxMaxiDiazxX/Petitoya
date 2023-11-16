import { Comidas } from "./Comidas"
import { Bebidas } from "./bebidas"

export const Menu = () => {
    return (
        <div className="sugerencias d-flex">
            <div className="comidas flex-grow-1 pr-3">
                <h4>Comidas</h4>
                <Comidas
                    nombre="Pasta Alfredo"
                    descripcion="Deliciosa pasta con salsa Alfredo."
                    precio="12.99"
                    imagenSrc="img/cafe.jpg"
                />
                                <Comidas
                    nombre="Pasta Alfredo"
                    descripcion="Deliciosa pasta con salsa Alfredo."
                    precio="12.99"
                    imagenSrc="img/cafe.jpg"
                />

                {/* Agrega más carteles de comida aquí */}
            </div>
            <div className="bebidas red flex-grow-1 pr-3">
                <h4>Bebidas</h4>
                <Bebidas
                    nombre="Refresco de Cola"
                    descripcion="Refresco carbonatado."
                    precio="2.99"
                    imagenSrc="img/cafe.jpg"
                />
                {/* Agrega más carteles de bebidas aquí */}
            </div>
        </div>
    )
}
